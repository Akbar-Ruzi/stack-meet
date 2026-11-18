import BookedEventRow from "@/components/my-events/BookedEventRow";
import PastBookedEventRow from "@/components/my-events/PastBookedEventRow";
import EmptyListState from "@/components/my-events/EmptyListState";
import type { BookedEvent } from "@/lib/data/my-events";

type BookedListProps = {
    upcoming: BookedEvent[];
    past: BookedEvent[]; // events that have ended, hidden as a section when empty
};

const SectionHeading = ({ title, note, className = "" }: { title: string; note: string; className?: string }) => (
    <h3 className={`text-lg text-text ${className}`}>
        {title} <span className="text-sm font-normal text-muted">· {note}</span>
    </h3>
);

const BookedList = ({ upcoming, past }: BookedListProps) => (
    <section aria-label="My bookings" className="flex flex-col gap-3.5">
        {upcoming.length === 0 ? (
            <EmptyListState message="No upcoming bookings." href="/#events" linkLabel="Find an event" />
        ) : (
            <SectionHeading title="Upcoming" note={`${upcoming.length} ${upcoming.length === 1 ? "event" : "events"}`} />
        )}
        {upcoming.map((booking) => (
            <BookedEventRow key={booking.bookingId} booking={booking} />
        ))}

        {past.length > 0 && (
            <>
                <SectionHeading title="Past events" note="these have already happened" className="mt-5.5" />
                {past.map((booking) => (
                    <PastBookedEventRow key={booking.bookingId} booking={booking} />
                ))}
            </>
        )}
    </section>
);

export default BookedList;
