import type { ReactNode } from "react";
import BookEvent from "@/components/events/BookEvent";
import HostingActions from "@/components/events/HostingActions";
import ShareLink from "@/components/events/ShareLink";
import SignInToBook from "@/components/events/SignInToBook";
import { formatBookedCount, formatLongDate, getBookingPlace, getConfirmationPlace } from "@/lib/events/display";
import type { BookingAccountUser } from "@/hooks/useBookingForm";
import type { ExistingBooking } from "@/lib/data/bookings";
import type { EventFields } from "@/types/event.types";

const Icon = ({ children }: { children: ReactNode }) => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
        {children}
    </svg>
);

type BookFormProps = {
    event: Pick<EventFields, "slug" | "title" | "date" | "time" | "mode" | "venue" | "location">;
    bookingCount: number | null; // null when the count couldn't be loaded
    account: BookingAccountUser | null; // the signed-in visitor, or null when signed out, who gets "Sign in to book"
    existingBooking: ExistingBooking | null; // the signed-in visitor's spot at this event, if they have one
    hosting: { canEdit: boolean } | null; // set when the signed-in visitor created this event, who can't book it
};

const BookForm = ({ event, bookingCount, account, existingBooking, hosting }: BookFormProps) => {
    const longDate = formatLongDate(event.date);

    // Rendered here on the server and handed to BookEvent, which hides it once the visitor has a spot.
    const header = (
        <>
            <p className="font-mono text-[13px] text-accent">{hosting ? "$ host --event" : "$ reserve --spot"}</p>
            <h2 className="mt-2 text-[26px]">{hosting ? "You’re hosting this event" : "Book your spot"}</h2>

            <dl className="mt-5.5 grid grid-cols-[24px_1fr] items-center gap-x-3 gap-y-3.5 text-[15px]">
                <dt aria-label="Date">
                    <Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></Icon>
                </dt>
                <dd>{longDate}</dd>
                <dt aria-label="Time">
                    <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
                </dt>
                <dd>{event.time}</dd>
                <dt aria-label="Location">
                    {event.mode === "online" ? (
                        <Icon><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></Icon>
                    ) : (
                        <Icon><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></Icon>
                    )}
                </dt>
                <dd>{getBookingPlace(event)}</dd>
            </dl>
        </>
    );
    const bookedLine = bookingCount === null ? null : formatBookedCount(bookingCount);

    return (
        <aside className="min-w-0 flex-[1_1_320px] max-w-100 rounded-[18px] border border-border bg-surface p-7 wrap-anywhere">
            {hosting ? (
                <>
                    {header}
                    <HostingActions slug={event.slug} canEdit={hosting.canEdit} />
                    {bookedLine && <p className="mt-3.5 text-sm text-muted">{bookedLine} so far</p>}
                </>
            ) : account ? (
                <BookEvent
                    account={account}
                    existingBooking={existingBooking}
                    header={header}
                    event={{ title: event.title, date: longDate, time: event.time, place: getConfirmationPlace(event) }}
                    bookedLine={bookedLine}
                />
            ) : (
                <>
                    {header}
                    <SignInToBook slug={event.slug} />
                    {bookedLine && <p className="mt-3.5 text-sm text-muted">{bookedLine}</p>}
                </>
            )}

            <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4.5 font-mono text-[13px]">
                <ShareLink />
            </div>
        </aside>
    );
};

export default BookForm;
