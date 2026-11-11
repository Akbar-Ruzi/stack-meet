'use server';
import { auth } from "@/auth";
import connectDB from "@/lib/data/mongodb";
import Booking from "@/database/booking.model";
import { bookingSchema } from "@/lib/bookings/booking-zod-schema";

type CreateBookingParams = {
    eventId: string;
    slug: string;
    email: string;
    name?: string; // Optional only until the Step 5 booking form sends it
    phone?: string;
}

type CreateBookingResult = {
    success: boolean;
    message?: string;
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
        const session = await auth();

        await Booking.create({
            eventId,
            userId: session?.user?.id, // Guests have no session, so this stays empty
            name: cleanName,
            email: normalizedEmail,
            phone: cleanPhone || undefined,
        });
        return {success: true} satisfies CreateBookingResult;
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