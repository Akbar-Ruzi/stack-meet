import Link from "next/link";
import Hero from "@/components/home/Hero";
import FormatFilter from "@/components/home/FormatFilter";
import HostBox from "@/components/home/HostBox";
import EventCard from "@/components/events/EventCard";
import { EventFields } from "@/database";
import { Suspense } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
    filterEvents,
    firstParam,
    getUpcomingEvents,
    isEventFormat,
    type EventFormat,
    type EventSearch,
} from "@/lib/event-search";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// The home page shows only the next few events. The calendar lists them all.
const NEXT_UP_LIMIT = 9;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type HomeQuery = EventSearch & { format?: EventFormat };

// TEMPORARY: in development, mock-data/events.json (git-ignored, local only) replaces the
// database so the UI can be built with sample events. Delete the file to use real data.
async function readMockEvents(): Promise<EventFields[] | null> {
    if (process.env.NODE_ENV !== "development") return null;
    try {
        return JSON.parse(await readFile(path.join(process.cwd(), "mock-data", "events.json"), "utf8"));
    } catch {
        return null;
    }
}

async function NextUp({ query }: { query: Promise<HomeQuery> }) {
    const { q, where, format } = await query;
    const allEvents: EventFields[] =
        (await readMockEvents()) ?? (await (await fetch(`${BASE_URL}/api/events`)).json()).events ?? [];

    const events = filterEvents(getUpcomingEvents(allEvents), { q, where })
        .filter((event) => !format || event.mode === format)
        .slice(0, NEXT_UP_LIMIT);

    return (
        <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[13px] text-muted">upcoming</p>
                    <h2 className="mt-1.5 text-4xl font-bold tracking-[-0.02em]">Next up</h2>
                </div>
                <FormatFilter q={q} where={where} format={format} />
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
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
    const query = searchParams.then((params) => {
        const format = firstParam(params.format);
        return {
            q: firstParam(params.q),
            where: firstParam(params.where),
            format: isEventFormat(format) ? format : undefined,
        };
    });

    return (
        <div data-full-width>
            <Hero search={query} />

            <section id="events" className="mx-auto max-w-[1200px] scroll-mt-28 px-6 pb-[72px] pt-6">
                <Suspense fallback={<p className="text-muted">Loading events...</p>}>
                    <NextUp query={query} />
                </Suspense>

                <div className="mt-7">
                    <Link href="/calendar" className="inline-block py-3 font-mono text-sm text-accent">
                        see all in calendar →
                    </Link>
                </div>
            </section>

            <HostBox />
        </div>
    );
}
