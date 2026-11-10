import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import ModeFilter from "@/components/home/ModeFilter";
import { getUpcomingEvents, type EventRecord } from "@/lib/data/events";
import type { HomeQuery } from "@/lib/url/home-query";

// The home page shows only the next few events. The calendar lists them all.
const NEXT_UP_LIMIT = 9;

const NextUp = async ({ query }: { query: Promise<HomeQuery> }) => {
    const { q, where, mode } = await query;
    const events = await getUpcomingEvents({ q, where, mode, limit: NEXT_UP_LIMIT }).catch((error): EventRecord[] => {
        console.error("Loading the home page events failed:", error);
        return [];
    });

    return (
        <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[13px] text-muted">upcoming</p>
                    <h2 className="mt-1.5 text-4xl font-bold tracking-[-0.02em]">Next up</h2>
                </div>
                <ModeFilter q={q} where={where} mode={mode} />
            </div>

            {events.length === 0 ? (
                <p className="text-muted">
                    No events match your search.{" "}
                    <Link href="/#events" className="text-accent">Clear search</Link>
                </p>
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-5">
                    {events.map((event) => (
                        <li key={event.slug} className="flex">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default NextUp;
