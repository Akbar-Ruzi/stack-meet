import BookedEventRow from "@/components/my-events/BookedEventRow";
import type { BookedEvent } from "@/lib/data/my-events";

const BookedList = ({ bookings }: { bookings: BookedEvent[] }) => (
    <section aria-label="My bookings" className="flex flex-col gap-3.5">
        {bookings.map((booking) => (
            <BookedEventRow key={booking.bookingId} booking={booking} />
        ))}
    </section>
);

export default BookedList;
