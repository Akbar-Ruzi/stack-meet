import "server-only";

import connectDB from "@/lib/data/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import { today } from "@/lib/data/events";

// Bookings hidden with hiddenByUser still count, because those spots were still booked.
export async function getBookingCount(eventId: string): Promise<number> {
    await connectDB();
    return Booking.countDocuments({ eventId });
}

// How many upcoming events this email has booked, not counting `exceptEventId`.
// Past events don't count, and a canceled booking is deleted, so it no longer counts either.
export async function countUpcomingBookingsByEmail(email: string, exceptEventId: string): Promise<number> {
    await connectDB();
    const eventIds = await Booking.distinct("eventId", { email, eventId: { $ne: exceptEventId } });
    if (eventIds.length === 0) return 0;
    return Event.countDocuments({ _id: { $in: eventIds }, date: { $gte: today() } });
}
