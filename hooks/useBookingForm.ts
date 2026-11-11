"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import toast from "react-hot-toast";
import { useBookingContext } from "@/context/booking-context";
import { createBooking } from "@/lib/actions/booking.action";
import { bookingSchema, toBookingErrors, type BookingErrors } from "@/lib/bookings/booking-zod-schema";

type BookingFormValues = { name: string; email: string; phone: string };

const EMPTY_VALUES: BookingFormValues = { name: "", email: "", phone: "" };
const BOOKING_FAILED_MESSAGE = "Unable to create booking right now. Please try again.";

export function useBookingForm() {
    const { eventId, slug } = useBookingContext();
    const router = useRouter();
    const [values, setValues] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState<BookingErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [onlineUrl, setOnlineUrl] = useState<string>();

    const setValue = (field: keyof BookingFormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = bookingSchema.safeParse(values);
        setErrors(result.success ? {} : toBookingErrors(result.error));
        if (!result.success) return;

        setIsSubmitting(true);
        try {
            const booking = await createBooking({ eventId, slug, ...values });

            if (booking.success) {
                setOnlineUrl(booking.onlineUrl);
                setSubmitted(true);
                posthog.capture("event_booked", { eventId, slug });
                router.refresh(); // Reloads the booked count from the server.
            } else {
                toast.error(booking.message ?? BOOKING_FAILED_MESSAGE);
                posthog.captureException("Booking creation failed");
            }
        } catch (error) {
            console.error("Booking creation failed:", error);
            toast.error(BOOKING_FAILED_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { values, errors, isSubmitting, submitted, onlineUrl, setValue, handleSubmit };
}
