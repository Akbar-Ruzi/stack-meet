"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import BookingAccount from "@/components/events/BookingAccount";
import BookingSuccess, { type BookedEventDetails } from "@/components/events/BookingSuccess";
import { FieldError } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useBookingForm, type BookingAccountUser } from "@/hooks/useBookingForm";
import type { ExistingBooking } from "@/lib/data/bookings";

type BookEventProps = {
    account: BookingAccountUser; // the signed-in visitor; signed-out visitors get "Sign in to book" instead
    existingBooking: ExistingBooking | null; // set when a signed-in visitor already has a spot, so the box shows on load
    header: ReactNode; // "$ reserve --spot", the title and the date / time / place list, hidden once booked
    event: BookedEventDetails;
    bookedLine: string | null; // "N people have booked", or null when the count couldn't be loaded
};

// The booking card's content: the form, then the "You're in!" box once the visitor has a spot.
const BookEvent = ({ account, existingBooking, header, event, bookedLine }: BookEventProps) => {
    const { isSubmitting, formError, booked, onlineUrl, handleSubmit } = useBookingForm(account, existingBooking);

    const countParagraph = bookedLine && <p className="mt-3.5 text-sm text-muted">{bookedLine}</p>;

    if (booked) {
        return (
            <>
                {/* Focus moves to the box only right after booking, not when the page opens with it. */}
                <BookingSuccess event={event} {...booked} onlineUrl={onlineUrl} moveFocus={!existingBooking} />
                {countParagraph}
            </>
        );
    }

    return (
        <>
            {header}
            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-2.5">
                <BookingAccount {...account} />
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
