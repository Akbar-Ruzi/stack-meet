import { Suspense, type ReactElement } from "react";
import { notFound } from "next/navigation";

import EventHeader from "@/components/events/EventHeader";
import EventContent from "@/components/events/EventContent";
import BookForm from "@/components/events/BookForm";
import { getEventBySlug, getSimilarEvents, type EventRecord } from "@/lib/data/events";
import { getBookingCount } from "@/lib/data/bookings";
import SimilarEvents from "@/components/events/SimilarEvents";
import {BookingProvider} from "@/context/booking-context";

type EventPageProps = {
    params: Promise<{ slug: string }>;
};

const EventDetailsContent = async ({ params }: EventPageProps): Promise<ReactElement> => {
    const { slug } = await params;// unwrap the Promise

    const event = await getEventBySlug(slug).catch((error) => {
        console.error("Loading the event failed:", error);
        return null;
    });

    if (!event || !event.description || !event.image) return notFound();

   const eventId = event._id;
    if (!eventId) return notFound();

    const [similarEvents, bookingCount] = await Promise.all([
        getSimilarEvents(event).catch((error): EventRecord[] => {
            console.error("Loading similar events failed:", error);
            return [];
        }),
        getBookingCount(eventId).catch((error) => {
            console.error("Loading the booking count failed:", error);
            return 0;
        }),
    ]);
    return (
        <section id="event" data-full-width>
            <EventHeader {...event} />
            <div className="mx-auto max-w-300 px-6 pb-10">
                {/* Event Details & Booking Form */}
                <div className="details">
                    {/* left side - Event Content */}
                    <EventContent event={event} />
                    {/* Right-side --Booking Form */}
                    <BookingProvider value={{eventId, slug: event.slug}}>
                        <BookForm event={event} bookingCount={bookingCount} />
                    </BookingProvider>
                </div>
                <SimilarEvents events={similarEvents} />
            </div>
        </section>
    )
}

const EventDetailsPage = ({ params }: EventPageProps) => {
    return (
        <Suspense fallback={<div>Loading event...</div>}>
            <EventDetailsContent params={params} />
        </Suspense>
    )
}

export default EventDetailsPage
