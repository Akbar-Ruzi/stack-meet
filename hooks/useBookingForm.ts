"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import toast from "react-hot-toast";
import { useBookingContext } from "@/context/booking-context";
import { createBooking } from "@/lib/actions/booking.action";

type BookingValues = { name: string; email: string; phone: string };
type BookingErrors = Partial<Record<keyof BookingValues, string>>;

const EMPTY_VALUES: BookingValues = { name: "", email: "", phone: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOOKING_FAILED_MESSAGE = "Unable to create booking right now. Please try again.";

function getFieldErrors({ name, email }: BookingValues): BookingErrors {
    const errors: BookingErrors = {};
    if (!name.trim()) errors.name = "Name is required.";

    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = "Please enter a valid email address.";

    return errors;
}

export function useBookingForm() {
    const { eventId, slug } = useBookingContext();
    const router = useRouter();
    const [values, setValues] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState<BookingErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const setValue = (field: keyof BookingValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fieldErrors = getFieldErrors(values);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const result = await createBooking({ eventId, slug, ...values });

            if (result.success) {
                setSubmitted(true);
                posthog.capture("event_booked", { eventId, slug, email: values.email });
                router.refresh(); // Reloads the booked count from the server.
            } else {
                toast.error(result.message ?? BOOKING_FAILED_MESSAGE);
                posthog.captureException("Booking creation failed");
            }
        } catch (error) {
            console.error("Booking creation failed:", error);
            toast.error(BOOKING_FAILED_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { values, errors, isSubmitting, submitted, setValue, handleSubmit };
}
