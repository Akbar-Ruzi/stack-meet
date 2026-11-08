import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FilterQuery } from "mongoose";

import connectDB from "@/lib/mongodb";
import { Event, type EventFields } from "@/database";
import { filterEvents, getUpcomingEvents as sortUpcoming, type EventMode, type EventSearch } from "@/lib/event-search";

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

const today = () => new Date().toISOString().slice(0, 10);

// Same cleanup as the home search: trimmed, lowercase, without a leading "#".
const clean = (value?: string) => value?.trim().toLowerCase().replace(/^#/, "") ?? "";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The database version of filterEvents in lib/event-search.ts, so the limit applies after filtering.
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

// TEMPORARY: in development, mock-data/events.json (git-ignored, local only) replaces the
// database so the UI can be built with sample events. Delete the file to use real data.
async function readMockEvents(): Promise<EventRecord[] | null> {
    if (process.env.NODE_ENV !== "development") return null;
    try {
        return JSON.parse(await readFile(path.join(process.cwd(), "mock-data", "events.json"), "utf8"));
    } catch {
        return null;
    }
}

// Events from today on, soonest first, matching the search and mode.
export async function getUpcomingEvents(options: UpcomingEventsOptions = {}): Promise<EventRecord[]> {
    const { limit, mode } = options;

    const mockEvents = await readMockEvents();
    if (mockEvents) {
        const matches = filterEvents(sortUpcoming(mockEvents), options).filter((event) => !mode || event.mode === mode);
        return limit ? matches.slice(0, limit) : matches;
    }

    await connectDB();
    const query = Event.find(buildUpcomingFilter(options)).select(PUBLIC_FIELDS).sort({ date: 1, time: 1 });
    if (limit) query.limit(limit);

    return (await query.lean<EventDoc[]>()).map(toRecord);
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) return null;

    await connectDB();
    const event = await Event.findOne({ slug: normalizedSlug }).select(PUBLIC_FIELDS).lean<EventDoc>();

    return event ? toRecord(event) : null;
}

// Other events that share at least one tag with the given event.
export async function getSimilarEvents(slug: string): Promise<EventRecord[]> {
    await connectDB();
    const event = await Event.findOne({ slug }).select("tags").lean<Pick<EventFields, "tags"> & { _id: unknown }>();
    if (!event?.tags?.length) return [];

    const similar = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } })
        .select(PUBLIC_FIELDS)
        .lean<EventDoc[]>();

    return similar.map(toRecord);
}
