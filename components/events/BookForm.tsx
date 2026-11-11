import type { ReactNode } from "react";
import BookEvent from "@/components/events/BookEvent";
import ShareLink from "@/components/events/ShareLink";
import { formatLongDate, getBookingPlace } from "@/lib/events/display";
import type { EventFields } from "@/types/event.types";

const Icon = ({ children }: { children: ReactNode }) => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
        {children}
    </svg>
);

type BookFormProps = {
    event: Pick<EventFields, "date" | "time" | "mode" | "venue" | "location">;
    bookingCount: number | null; // null when the count couldn't be loaded
};

const BookForm = ({ event, bookingCount }: BookFormProps) => (
    <aside className="min-w-0 flex-[1_1_320px] max-w-100 rounded-[18px] border border-border bg-surface p-7 wrap-anywhere">
        <p className="font-mono text-[13px] text-accent">$ reserve --spot</p>
        <h2 className="mt-2 text-[26px]">Book your spot</h2>

        <dl className="mt-5.5 grid grid-cols-[24px_1fr] items-center gap-x-3 gap-y-3.5 text-[15px]">
            <dt aria-label="Date">
                <Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></Icon>
            </dt>
            <dd>{formatLongDate(event.date)}</dd>
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

        <BookEvent />

        <p className="mt-3.5 text-sm text-muted">
            No account needed
            {bookingCount !== null && ` · ${bookingCount} ${bookingCount === 1 ? "person has" : "people have"} booked`}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4.5 font-mono text-[13px]">
            <ShareLink />
        </div>
    </aside>
);

export default BookForm;
