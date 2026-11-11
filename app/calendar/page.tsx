import { Suspense } from "react";
import CalendarSearch, { CalendarSearchWithValues } from "@/components/calendar/CalendarSearch";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import CalendarTimeline from "@/components/calendar/CalendarTimeline";
import { getCalendarEvents, type EventRecord } from "@/lib/data/events";
import { parseCalendarQuery, type CalendarSearchParams } from "@/lib/url/calendar-query";

export default function CalendarPage({ searchParams }: { searchParams: Promise<CalendarSearchParams> }) {
    const search = searchParams.then(parseCalendarQuery);
    // One query, shared by the search status row and the timeline.
    const events = search.then(getCalendarEvents).catch((error): EventRecord[] => {
        console.error("Loading the calendar events failed:", error);
        return [];
    });

    return (
        <div data-full-width>
            <section className="mx-auto flex max-w-300 flex-wrap items-end justify-between gap-8 px-6 pb-10 pt-16">
                <div className="flex-[1_1_480px]">
                    <p className="font-mono text-[14px] text-accent">{"// calendar"}</p>
                    <h1 className="mt-4 bg-none text-[clamp(40px,5.5vw,72px)] font-bold leading-none tracking-[-0.035em] text-text">
                        Every event,<br />by date.
                    </h1>
                    <p className="mt-4.5 max-w-130 text-lg leading-[1.55] text-muted">
                        Scroll the months ahead, or narrow it down by format, topic and city.
                    </p>
                </div>
                <Suspense fallback={<CalendarSearch />}>
                    <CalendarSearchWithValues search={search} events={events} />
                </Suspense>
            </section>

            <section className="mx-auto flex max-w-300 flex-wrap items-start gap-10 px-6 pb-24">
                <Suspense fallback={null}>
                    <CalendarSidebar search={search} />
                </Suspense>
                <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-12">
                    <Suspense fallback={<p className="text-muted">Loading events...</p>}>
                        <CalendarTimeline search={search} events={events} />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
