"use client";

import Button from "@/components/ui/Button";
import BookingAccount from "@/components/events/BookingAccount";
import BookingField from "@/components/events/BookingField";
import BookingSuccess from "@/components/events/BookingSuccess";
import { FieldError } from "@/components/ui/Input";
import { useBookingForm, type BookingAccountUser } from "@/hooks/useBookingForm";

// account is the signed-in visitor, or null for a guest, who fills in the fields.
const BookEvent = ({ account }: { account: BookingAccountUser | null }) => {
    const { values, errors, isSubmitting, formError, bookedName, onlineUrl, setValue, handleSubmit } = useBookingForm(account);

    if (bookedName !== null) return <BookingSuccess name={bookedName} onlineUrl={onlineUrl} />;

    return (
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Reserving…" : "Reserve my spot"}
                </Button>
            </div>
        </form>
    );
};

export default BookEvent;
