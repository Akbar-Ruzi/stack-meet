import "server-only";

import { cache } from "react";
import type { FilterQuery } from "mongoose";

import connectDB from "@/lib/data/mongodb";
import { Event } from "@/database";
import type { EventFields } from "@/types/event.types";
import type { EventMode, EventSearch } from "@/lib/events/search";
import type { CalendarSearch } from "@/lib/events/calendar";
import { FORMAT_LABELS } from "@/lib/events/display";

// An event as pages receive it: plain data with string ids, safe to pass to client components.
export type EventRecord = EventFields & { _id: string; createdBy: string };

export type UpcomingEventsOptions = EventSearch & { mode?: EventMode; limit?: number };

// Older events can be missing createdBy.
type EventDoc = EventFields & { _id: { toString(): string }; createdBy?: { toString(): string } };

// Leaves out the timestamps and version key, which pages don't use and which can't be passed to client components.
const PUBLIC_FIELDS = "-createdAt -updatedAt -__v";

const toRecord = (doc: EventDoc): EventRecord => ({
    ...doc,
    _id: doc._id.toString(),
    createdBy: doc.createdBy?.toString() ?? "",
});

// Today as "YYYY-MM-DD", the format events store their date in. Events on or after it are upcoming.
export const today = () => new Date().toISOString().slice(0, 10);

// Same cleanup as the home search: trimmed, lowercase, without a leading "#".
const clean = (value?: string) => value?.trim().toLowerCase().replace(/^#/, "") ?? "";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The database version of filterEvents in lib/events/search.ts, so the limit applies after filtering.
function buildUpcomingFilter({ q, where, mode }: UpcomingEventsOptions): FilterQuery<EventFields> {
    const conditions: FilterQuery<EventFields>[] = [{ date: { $gte: today() } }];

    const what = clean(q);
    if (what) {
        const pattern = new RegExp(escapeRegex(what), "i");
        conditions.push({ $or: [{ title: pattern }, { tags: pattern }] });
    }

    const place = clean(where);
    if (place === "online") conditions.push({ mode: { $ne: "in-person" } });
    else if (place) conditions.push({ location: new RegExp(escapeRegex(place), "i") });

    if (mode) conditions.push({ mode });

    return { $and: conditions };
}

// Events from today on, soonest first, matching the search and mode.
export async function getUpcomingEvents(options: UpcomingEventsOptions = {}): Promise<EventRecord[]> {
    const { limit } = options;

    await connectDB();
    const query = Event.find(buildUpcomingFilter(options)).select(PUBLIC_FIELDS).sort({ date: 1, time: 1 });
    if (limit) query.limit(limit);

    return (await query.lean<EventDoc[]>()).map(toRecord);
}

// Wrapped in React's cache(), so components that ask for the same slug during one request share a single query.
export const getEventBySlug = cache(async (slug: string): Promise<EventRecord | null> => {
    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) return null;

    await connectDB();
    const event = await Event.findOne({ slug: normalizedSlug }).select(PUBLIC_FIELDS).lean<EventDoc>();

    return event ? toRecord(event) : null;
});

// How many events this user created, upcoming and past.
export async function countEventsByUser(userId: string): Promise<number> {
    await connectDB();
    return Event.countDocuments({ createdBy: userId });
}

// The calendar's search matches the title, a tag, the city or the format name ("online", "hybrid"…).
function buildCalendarFilter({ q, formats, topics, city }: CalendarSearch): FilterQuery<EventFields> {
    const conditions: FilterQuery<EventFields>[] = [{ date: { $gte: today() } }];

    const what = clean(q);
    if (what) {
        const pattern = new RegExp(escapeRegex(what), "i");
        const modes = (Object.keys(FORMAT_LABELS) as EventMode[]).filter((mode) =>
            FORMAT_LABELS[mode].toLowerCase().includes(what),
        );
        conditions.push({
            $or: [{ title: pattern }, { tags: pattern }, { location: pattern }, ...(modes.length ? [{ mode: { $in: modes } }] : [])],
        });
    }

    if (formats) conditions.push({ mode: { $in: formats } }); // [] matches nothing, on purpose
    if (topics.length) conditions.push({ tags: { $in: topics } });
    if (city) conditions.push({ location: new RegExp(escapeRegex(city), "i") });

    return { $and: conditions };
}

// Upcoming events matching the calendar's search and filters, soonest first.
export async function getCalendarEvents(search: CalendarSearch): Promise<EventRecord[]> {
    await connectDB();
    const events = await Event.find(buildCalendarFilter(search))
        .select(PUBLIC_FIELDS)
        .sort({ date: 1, time: 1 })
        .lean<EventDoc[]>();

    return events.map(toRecord);
}

// The tags used most by upcoming events, most used first, for the calendar's topic filter.
export async function getPopularTags(limit: number): Promise<string[]> {
    await connectDB();
    const rows = await Event.aggregate<{ _id: string }>([
        { $match: { date: { $gte: today() } } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: limit },
    ]);

    return rows.map((row) => row._id);
}

// Upcoming events that share a tag with the given event, soonest first. When there are fewer
// than `limit`, the rest is filled with other upcoming events, so the section is never empty.
export async function getSimilarEvents(
    event: Pick<EventRecord, "_id" | "tags">,
    limit = 3,
): Promise<EventRecord[]> {
    await connectDB();

    const findUpcoming = (filter: FilterQuery<EventFields>, count: number) =>
        Event.find({ date: { $gte: today() }, ...filter })
            .select(PUBLIC_FIELDS)
            .sort({ date: 1, time: 1 })
            .limit(count)
            .lean<EventDoc[]>();

    const similar = event.tags?.length
        ? await findUpcoming({ _id: { $ne: event._id }, tags: { $in: event.tags } }, limit)
        : [];

    const missing = limit - similar.length;
    const fallback = missing > 0
        ? await findUpcoming({ _id: { $nin: [event._id, ...similar.map((doc) => doc._id)] } }, missing)
        : [];

    return [...similar, ...fallback].map(toRecord);
}
