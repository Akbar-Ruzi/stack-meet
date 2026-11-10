import { Suspense } from "react";
import { notFound } from "next/navigation";

import EventHeader from "@/components/events/EventHeader";
import EventContent from "@/components/events/EventContent";
import BookForm from "@/components/events/BookForm";
import { getEventBySlug, getSimilarEvents, type EventRecord } from "@/lib/data/events";
import EventCard from "@/components/events/EventCard";
import {BookingProvider} from "@/context/booking-context";

type EventPageProps = {
    params: Promise<{ slug: string }>;
};

const EventDetailsContent = async ({ params }: EventPageProps) => {
    const { slug } = await params;// unwrap the Promise

    const event = await getEventBySlug(slug).catch((error) => {
        console.error("Loading the event failed:", error);
        return null;
    });

    if (!event || !event.description || !event.image) return notFound();

   const eventId = event._id;
    if (!eventId) return notFound();

    const similarEvents = await getSimilarEvents(slug).catch((error): EventRecord[] => {
        console.error("Loading similar events failed:", error);
        return [];
    });
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
                        <BookForm />
                    </BookingProvider>
                </div>
                {/* Similar Events */}
                {similarEvents.length > 0 && (
                    <div className="flex w-full flex-col gap-4 pt-18">
                        <h2>Similar Events</h2>
                        <div className="events">
                            {similarEvents.map((similarEvents) => (
                                <EventCard key={similarEvents.title} {...similarEvents} />
                            ))}
                        </div>
                    </div>
                )}
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
