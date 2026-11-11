import { Suspense } from "react";

import EventMainContent from "@/components/events/EventMainContent";
import SimilarEventsSection from "@/components/events/SimilarEventsSection";

type EventPageProps = {
    params: Promise<{ slug: string }>;
};

// Two boundaries, so the event shows without waiting for the similar-events query.
const EventDetailsPage = ({ params }: EventPageProps) => {
    const slug = params.then((p) => p.slug);

    return (
        <section id="event" data-full-width>
            <Suspense fallback={<div>Loading event...</div>}>
                <EventMainContent slug={slug} />
            </Suspense>
            <div className="mx-auto max-w-300 px-6 pb-10">
                <Suspense fallback={null}>
                    <SimilarEventsSection slug={slug} />
                </Suspense>
            </div>
        </section>
    );
};

export default EventDetailsPage;
