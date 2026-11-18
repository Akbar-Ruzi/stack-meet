'use server';
import { auth } from "@/auth";
import connectDB from "@/lib/data/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import { countUpcomingBookingsByUser, getBookingCount, hasUserBookedEvent } from "@/lib/data/bookings";
import { hasEventEnded, isEventCreatedBy } from "@/lib/data/events";
import { getBookingContact } from "@/lib/data/users";

// Bookings one event can take.
const MAX_BOOKINGS_PER_EVENT = 200;
// Different upcoming events one user can book at once. Past and removed bookings don't count.
const MAX_UPCOMING_BOOKINGS_PER_USER = 3;

type CreateBookingParams = {
    eventId: string;
}

type CreateBookingResult = {
    success: boolean;
    message?: string;
    onlineUrl?: string; // Sent only after a successful booking, because the app can't email it
}

// Only signed-in users can book. The name, email and phone come from their account.
export const createBooking = async ({eventId}: CreateBookingParams) => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) {
            return {success: false, message: 'Please sign in to book a spot.'} satisfies CreateBookingResult;
        }

        // Checked here too, not only on the page, so a page opened before the event ended can't book it.
        if (await hasEventEnded(eventId)) {
            return {success: false, message: 'Booking is closed for this event.'} satisfies CreateBookingResult;
        }

        // Taken from the account, so a booking can't be saved to it under someone else's email.
        const account = await getBookingContact(userId);
        if (!account) {
            return {success: false, message: 'Your account could not be found. Please sign in again.'} satisfies CreateBookingResult;
        }
        // Checked here too, not only on the page, so the rule holds even without the form.
        if (await isEventCreatedBy(eventId, userId)) {
            return {success: false, message: "You're the organizer, so you can't book a spot here."} satisfies CreateBookingResult;
        }
        if (await hasUserBookedEvent(userId, eventId)) {
            return {success: false, message: 'You already have a spot at this event.'} satisfies CreateBookingResult;
        }
        const { name, email, phone } = account;

        await connectDB();

        // A plain count, so parallel bookings right at the limit can go slightly over, which is fine for a usage cap.
        if (await getBookingCount(eventId) >= MAX_BOOKINGS_PER_EVENT) {
            return {success: false, message: 'This event is fully booked.'} satisfies CreateBookingResult;
        }

        // The same count as My events → Booked. This event isn't in it, because the duplicate check above already passed.
        if (await countUpcomingBookingsByUser(userId) >= MAX_UPCOMING_BOOKINGS_PER_USER) {
            return {
                success: false,
                message: `You can book up to ${MAX_UPCOMING_BOOKINGS_PER_USER} upcoming events at a time, and you already have ${MAX_UPCOMING_BOOKINGS_PER_USER}. Cancel one in My events → Booked to book this one.`,
            } satisfies CreateBookingResult;
        }

        await Booking.create({
            eventId,
            userId,
            name,
            email,
            phone,
        });
        // onlineUrl is left out of event reads by default, so it's asked for explicitly here.
        const event = await Event.findById(eventId).select("+onlineUrl mode").lean<{ mode: string; onlineUrl?: string }>();
        const onlineUrl = event && event.mode !== "in-person" ? event.onlineUrl : undefined;

        return {success: true, onlineUrl} satisfies CreateBookingResult;
    } catch (e) {
        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: number }).code === 11000) {
            return {
                success: false,
                message: 'This email is already registered for this event.',
            } satisfies CreateBookingResult;
        }

        console.log('Create booking failed:', e);
        return {success: false, message: 'Unable to create booking right now. Please try again.'} satisfies CreateBookingResult;
    }
}