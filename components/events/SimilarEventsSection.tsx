import type { ReactElement } from "react";

import SimilarEvents from "@/components/events/SimilarEvents";
import { getEventBySlug, getSimilarEvents, type EventRecord } from "@/lib/data/events";

// Loads its own data, so its <Suspense> boundary doesn't hold up the main event content.
const SimilarEventsSection = async ({ slug }: { slug: Promise<string> }): Promise<ReactElement | null> => {
    // Shares the main content's query, because getEventBySlug is cached per request.
    const event = await getEventBySlug(await slug).catch(() => null);
    if (!event) return null; // The main content shows the 404 page.

    const similarEvents = await getSimilarEvents(event).catch((error): EventRecord[] => {
        console.error("Loading similar events failed:", error);
        return [];
    });

    return <SimilarEvents events={similarEvents} />;
};

export default SimilarEventsSection;
