"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import BookingAccount from "@/components/events/BookingAccount";
import BookingField from "@/components/events/BookingField";
import BookingSuccess, { type BookedEventDetails } from "@/components/events/BookingSuccess";
import { FieldError } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useBookingForm, type BookingAccountUser } from "@/hooks/useBookingForm";
import type { ExistingBooking } from "@/lib/data/bookings";

type BookEventProps = {
    account: BookingAccountUser | null; // the signed-in visitor, or null for a guest, who fills in the fields
    existingBooking: ExistingBooking | null; // set when a signed-in visitor already has a spot, so the box shows on load
    header: ReactNode; // "$ reserve --spot", the title and the date / time / place list, hidden once booked
    event: BookedEventDetails;
    bookedLine: string | null; // "N people have booked", or null when the count couldn't be loaded
};

// The booking card's content: the form, then the "You're in!" box once the visitor has a spot.
const BookEvent = ({ account, existingBooking, header, event, bookedLine }: BookEventProps) => {
    const { values, errors, isSubmitting, formError, booked, onlineUrl, setValue, handleSubmit } = useBookingForm(account, existingBooking);

    const countParagraph = bookedLine && <p className="mt-3.5 text-sm text-muted">{bookedLine}</p>;

    if (booked) {
        return (
            <>
                {/* Focus moves to the box only right after booking, not when the page opens with it. */}
                <BookingSuccess event={event} {...booked} onlineUrl={onlineUrl} signedIn={account !== null} moveFocus={!existingBooking} />
                {countParagraph}
            </>
        );
    }

    return (
        <>
            {header}
            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-2.5">
                {account ? (
                    <BookingAccount {...account} />
                ) : (
                    <>
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
                    </>
                )}
                <div>
                    {/* Always rendered, so screen readers announce the message when it appears. */}
                    <div role="alert">
                        {formError && <div className="mb-2.5"><FieldError message={formError} /></div>}
                    </div>
                    {/* aria-disabled instead of disabled keeps focus on the button; the hook ignores a second click. */}
                    <Button
                        type="submit"
                        aria-disabled={isSubmitting}
                        className="w-full gap-2.5 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
                    >
                        {isSubmitting && <Spinner size={16} />}
                        {isSubmitting ? "Booking…" : "Book now"}
                    </Button>
                </div>
            </form>
            {countParagraph}
        </>
    );
};

export default BookEvent;
