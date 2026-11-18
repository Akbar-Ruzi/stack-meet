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

// How many upcoming events this user has a spot at. Removed (hidden) bookings don't count.
export async function countUpcomingBookingsByUser(userId: string): Promise<number> {
    await connectDB();
    const eventIds = await Booking.distinct("eventId", { userId, hiddenByUser: { $ne: true } });
    if (eventIds.length === 0) return 0;
    return Event.countDocuments({ _id: { $in: eventIds }, date: { $gte: today() } });
}

// Whether this user already has a spot at the event.
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
