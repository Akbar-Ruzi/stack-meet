"use client";

import Button from "@/components/ui/Button";
import BookingField from "@/components/events/BookingField";
import BookingSuccess from "@/components/events/BookingSuccess";
import { useBookingForm } from "@/hooks/useBookingForm";

const BookEvent = () => {
    const { values, errors, isSubmitting, submitted, onlineUrl, setValue, handleSubmit } = useBookingForm();

    if (submitted) return <BookingSuccess name={values.name.trim()} onlineUrl={onlineUrl} />;

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-2.5">
            <BookingField
                id="booking-name"
                label="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={(e) => setValue("name", e.target.value)}
                error={errors.name}
            />
            <BookingField
                id="booking-email"
                label="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                error={errors.email}
            />
            <BookingField
                id="booking-phone"
                label="phone"
                optional
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 123-4567"
                hint="Only used for last-minute event updates."
                value={values.phone}
                onChange={(e) => setValue("phone", e.target.value)}
                error={errors.phone}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>Reserve my spot</Button>
        </form>
    );
};

export default BookEvent;
