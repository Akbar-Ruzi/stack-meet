'use server';
import { auth } from "@/auth";
import connectDB from "@/lib/data/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import { bookingSchema } from "@/lib/bookings/booking-zod-schema";
import { getBookingCount } from "@/lib/data/bookings";

// Bookings one event can take.
const MAX_BOOKINGS_PER_EVENT = 200;

type CreateBookingParams = {
    eventId: string;
    slug: string;
    email: string;
    name?: string;
    phone?: string;
}

type CreateBookingResult = {
    success: boolean;
    message?: string;
    onlineUrl?: string; // Sent only after a successful booking, because the app can't email it
}

export const createBooking = async ({eventId, email, name, phone}: CreateBookingParams) => {
    try {
        // The same rules as the form. The schema also trims the values and lowercases the email.
        const parsed = bookingSchema.safeParse({ name, email, phone });
        if (!parsed.success) {
            return {success: false, message: parsed.error.issues[0].message} satisfies CreateBookingResult;
        }
        const { name: cleanName, email: normalizedEmail, phone: cleanPhone } = parsed.data;

        await connectDB();

        // A plain count, so parallel bookings right at the limit can go slightly over, which is fine for a usage cap.
        if (await getBookingCount(eventId) >= MAX_BOOKINGS_PER_EVENT) {
            return {success: false, message: 'This event is fully booked.'} satisfies CreateBookingResult;
        }

        const session = await auth();

        await Booking.create({
            eventId,
            userId: session?.user?.id, // Guests have no session, so this stays empty
            name: cleanName,
            email: normalizedEmail,
            phone: cleanPhone || undefined,
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