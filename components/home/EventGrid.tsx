import Link from "next/link";
import EventCard from "@/components/home/EventCard";
import { getUpcomingEvents, type EventRecord } from "@/lib/data/events";
import type { HomeQuery } from "@/lib/url/home-query";

// The home page shows only the next few events. The calendar lists them all.
const NEXT_UP_LIMIT = 21;

// The "Next up" grid, or a line when nothing matches the search.
const EventGrid = async ({ q, where, mode }: HomeQuery) => {
    const events = await getUpcomingEvents({ q, where, mode, limit: NEXT_UP_LIMIT }).catch((error): EventRecord[] => {
        console.error("Loading the home page events failed:", error);
        return [];
    });

    if (events.length === 0) {
        return (
            <p className="text-muted">
                No events match your search.{" "}
                <Link href="/#events" className="text-accent">Clear search</Link>
            </p>
        );
    }

    return (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-5">
            {events.map((event) => (
                <li key={event.slug} className="flex">
                    <EventCard {...event} />
                </li>
            ))}
        </ul>
    );
};

export default EventGrid;
