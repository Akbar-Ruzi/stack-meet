"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useBookingContext } from "@/context/booking-context";
import { createBooking } from "@/lib/actions/booking.action";
import type { ExistingBooking } from "@/lib/data/bookings";

// The signed-in visitor's name and email, shown on the card and in the "You're in!" box.
export type BookingAccountUser = { name: string; email: string };

const BOOKING_FAILED_MESSAGE = "Couldn't reserve your spot. Please try again.";

// Books the signed-in visitor's spot. There are no fields: the server takes the details from the account.
// A failed booking keeps the form and returns formError, shown above the Book now button.
export function useBookingForm(account: BookingAccountUser, existingBooking: ExistingBooking | null) {
    const { eventId, slug } = useBookingContext();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    // Who the spot was booked for: the existing booking on load, or set once a booking succeeds.
    const [booked, setBooked] = useState<BookingAccountUser | null>(
        existingBooking && { name: existingBooking.name, email: existingBooking.email },
    );
    const [onlineUrl, setOnlineUrl] = useState(existingBooking?.onlineUrl);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setFormError(null);

        setIsSubmitting(true);
        try {
            const booking = await createBooking({ eventId });

            if (booking.success) {
                setOnlineUrl(booking.onlineUrl);
                setBooked(account);
                posthog.capture("event_booked", { eventId, slug });
                router.refresh(); // Reloads the booked count from the server.
            } else {
                setFormError(booking.message ?? BOOKING_FAILED_MESSAGE);
                posthog.captureException("Booking creation failed");
            }
        } catch (error) {
            console.error("Booking creation failed:", error);
            setFormError(BOOKING_FAILED_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, formError, booked, onlineUrl, handleSubmit };
}
