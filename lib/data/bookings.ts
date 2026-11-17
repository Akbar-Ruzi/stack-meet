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

// How many upcoming events this signed-in user has a spot at. Guest bookings made with
// the same email don't count, because emails aren't verified yet.
export async function countUpcomingBookingsByUser(userId: string): Promise<number> {
    await connectDB();
    const eventIds = await Booking.distinct("eventId", { userId, hiddenByUser: { $ne: true } });
    if (eventIds.length === 0) return 0;
    return Event.countDocuments({ _id: { $in: eventIds }, date: { $gte: today() } });
}

// Whether this signed-in user already has a spot at the event. Guest bookings made with
// the same email don't count, because emails aren't verified yet.
export async function hasUserBookedEvent(userId: string, eventId: string): Promise<boolean> {
    await connectDB();
    return (await Booking.exists({ userId, eventId })) !== null;
}

export type ExistingBooking = { name: string; email: string; onlineUrl?: string };

// The signed-in user's booking for this event, with the join link for online and hybrid events,
// so a returning visitor sees the "You're in!" box. null when they have no spot here.
export async function getUserBooking(userId: string, eventId: string): Promise<ExistingBooking | null> {
    await connectDB();
    const [booking, event] = await Promise.all([
        Booking.findOne({ userId, eventId }).select("name email").lean<{ name: string; email: string }>(),
        // onlineUrl is left out of event reads by default, so it's asked for explicitly here.
        Event.findById(eventId).select("+onlineUrl mode").lean<{ mode: string; onlineUrl?: string }>(),
    ]);
    if (!booking) return null;

    const onlineUrl = event && event.mode !== "in-person" ? event.onlineUrl : undefined;
    return { name: booking.name, email: booking.email, onlineUrl };
}

// How many upcoming events this email has booked, not counting `exceptEventId`.
// Past events don't count, and a canceled booking is deleted, so it no longer counts either.
export async function countUpcomingBookingsByEmail(email: string, exceptEventId: string): Promise<number> {
    await connectDB();
    const eventIds = await Booking.distinct("eventId", { email, eventId: { $ne: exceptEventId } });
    if (eventIds.length === 0) return 0;
    return Event.countDocuments({ _id: { $in: eventIds }, date: { $gte: today() } });
}
