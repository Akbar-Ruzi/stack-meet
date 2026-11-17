import { Suspense } from "react";
import EventGrid from "@/components/home/EventGrid";
import EventGridSkeleton from "@/components/home/EventGridSkeleton";
import ModeFilter from "@/components/home/ModeFilter";
import type { HomeQuery } from "@/lib/url/home-query";

// Fills in the selected filter pill once the URL is known.
const ModeFilterWithValues = async ({ query }: { query: Promise<HomeQuery> }) => <ModeFilter {...await query} />;

// A new key for each search and filter remounts the boundary, so the skeleton shows again
// while the new results load, instead of the old grid staying on screen.
const EventGridForQuery = async ({ query }: { query: Promise<HomeQuery> }) => {
    const { q, where, mode } = await query;

    return (
        <Suspense key={JSON.stringify([q, where, mode])} fallback={<EventGridSkeleton />}>
            <EventGrid q={q} where={where} mode={mode} />
        </Suspense>
    );
};

// The heading and the filter pills show right away; only the grid waits for the events.
const NextUp = ({ query }: { query: Promise<HomeQuery> }) => (
    <>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="font-mono text-[13px] text-muted">upcoming</p>
                <h2 className="mt-1.5 text-4xl font-bold tracking-[-0.02em]">Next up</h2>
            </div>
            <Suspense fallback={<ModeFilter />}>
                <ModeFilterWithValues query={query} />
            </Suspense>
        </div>

        <Suspense fallback={<EventGridSkeleton />}>
            <EventGridForQuery query={query} />
        </Suspense>
    </>
);

export default NextUp;
