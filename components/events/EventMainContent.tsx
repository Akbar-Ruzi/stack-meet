import type { ReactElement } from "react";
import { notFound } from "next/navigation";

import EventHeader from "@/components/events/EventHeader";
import EventContent from "@/components/events/EventContent";
import BookForm from "@/components/events/BookForm";
import { BookingProvider } from "@/context/booking-context";
import { getEventBySlug } from "@/lib/data/events";
import { getBookingCount } from "@/lib/data/bookings";

// The event itself: header, cover, About, agenda, organizer and the booking card.
const EventMainContent = async ({ slug }: { slug: Promise<string> }): Promise<ReactElement> => {
    const event = await getEventBySlug(await slug).catch((error) => {
        console.error("Loading the event failed:", error);
        return null;
    });

    if (!event || !event.description || !event.image) return notFound();

    const bookingCount = await getBookingCount(event._id).catch((error) => {
        console.error("Loading the booking count failed:", error);
        return 0;
    });

    return (
        <>
            <EventHeader {...event} />
            <div className="mx-auto max-w-300 px-6">
                <div className="details">
                    <EventContent event={event} />
                    <BookingProvider value={{ eventId: event._id, slug: event.slug }}>
                        <BookForm event={event} bookingCount={bookingCount} />
                    </BookingProvider>
                </div>
            </div>
        </>
    );
};

export default EventMainContent;
