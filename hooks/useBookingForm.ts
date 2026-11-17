"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useBookingContext } from "@/context/booking-context";
import { createBooking } from "@/lib/actions/booking.action";
import { bookingSchema, toBookingErrors, type BookingErrors } from "@/lib/bookings/booking-zod-schema";
import type { ExistingBooking } from "@/lib/data/bookings";

type BookingFormValues = { name: string; email: string; phone: string };

// The signed-in visitor's name and email, shown in place of the form fields.
export type BookingAccountUser = { name: string; email: string };

const EMPTY_VALUES: BookingFormValues = { name: "", email: "", phone: "" };
const BOOKING_FAILED_MESSAGE = "Couldn't reserve your spot. Please try again.";

// A failed booking keeps the form and returns formError, shown above the Reserve button.
export function useBookingForm(account: BookingAccountUser | null, existingBooking: ExistingBooking | null) {
    const { eventId, slug } = useBookingContext();
    const router = useRouter();
    const [values, setValues] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState<BookingErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    // Who the spot was booked for: the existing booking on load, or set once a booking succeeds.
    const [booked, setBooked] = useState<BookingAccountUser | null>(
        existingBooking && { name: existingBooking.name, email: existingBooking.email },
    );
    const [onlineUrl, setOnlineUrl] = useState(existingBooking?.onlineUrl);

    const setValue = (field: keyof BookingFormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setFormError(null);

        // Signed in, there are no fields: the server takes the details from the account.
        let guestDetails: BookingFormValues | null = null;
        if (!account) {
            const result = bookingSchema.safeParse(values);
            setErrors(result.success ? {} : toBookingErrors(result.error));
            if (!result.success) return;
            guestDetails = result.data;
        }

        setIsSubmitting(true);
        try {
            const booking = await createBooking({ eventId, slug, ...guestDetails });

            if (booking.success) {
                setOnlineUrl(booking.onlineUrl);
                setBooked(account ?? { name: guestDetails?.name ?? "", email: guestDetails?.email ?? "" });
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

    return { values, errors, isSubmitting, formError, booked, onlineUrl, setValue, handleSubmit };
}
