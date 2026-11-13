import "server-only";

import connectDB from "@/lib/data/mongodb";
import { Booking, Event } from "@/database";
import type { EventFields } from "@/types/event.types";
import { today } from "@/lib/data/events";

export type HostedEvent = Pick<EventFields, "title" | "slug" | "date" | "time" | "mode" | "location"> & {
    _id: string;
    bookedCount: number;
    isUpcoming: boolean;
};

type HostedEventDoc = Omit<HostedEvent, "_id" | "bookedCount" | "isUpcoming"> & { _id: { toString(): string } };

// The events this user created: upcoming ones soonest first, then past ones most recent first.
// Each comes with its booking count, including bookings attendees hid from their own list.
export async function getHostedEvents(userId: string): Promise<HostedEvent[]> {
    await connectDB();
    const events = await Event.find({ createdBy: userId })
        .select("title slug date time mode location")
        .sort({ date: 1, time: 1 })
        .lean<HostedEventDoc[]>();
    if (events.length === 0) return [];

    const counts = await Booking.aggregate<{ _id: { toString(): string }; count: number }>([
        { $match: { eventId: { $in: events.map((event) => event._id) } } },
        { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);
    const countById = new Map(counts.map((row) => [row._id.toString(), row.count]));

    const now = today();
    const hosted = events.map((event): HostedEvent => {
        const _id = event._id.toString();
        return { ...event, _id, bookedCount: countById.get(_id) ?? 0, isUpcoming: event.date >= now };
    });

    const upcoming = hosted.filter((event) => event.isUpcoming);
    const past = hosted.filter((event) => !event.isUpcoming).reverse();
    return [...upcoming, ...past];
}
