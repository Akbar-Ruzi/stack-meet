import CalendarEmptyState from "@/components/calendar/CalendarEmptyState";
import TimelineEvent from "@/components/calendar/TimelineEvent";
import type { EventRecord } from "@/lib/data/events";
import { groupEventsByMonth, hasCalendarFilters, type CalendarSearch } from "@/lib/events/calendar";
import { calendarHref } from "@/lib/url/calendar-query";

type CalendarTimelineProps = {
    search: Promise<CalendarSearch>;
    events: Promise<EventRecord[]>;
};

// The matching events, soonest first, grouped by month. Months with no matches don't appear.
const CalendarTimeline = async ({ search: searchPromise, events: eventsPromise }: CalendarTimelineProps) => {
    const [search, events] = await Promise.all([searchPromise, eventsPromise]);

    if (events.length === 0) {
        if (search.q) {
            return <CalendarEmptyState title="No events match your search." action="Clear search" href={calendarHref({ ...search, q: undefined })} />;
        }
        if (hasCalendarFilters(search)) {
            return <CalendarEmptyState title="No events match your filters." action="Clear filters" href="/calendar" />;
        }
        return <p className="text-muted">No upcoming events yet.</p>;
    }

    return groupEventsByMonth(events).map((month) => (
        <section key={month.key} aria-labelledby={`month-${month.key}`}>
            <h2 id={`month-${month.key}`} className="mb-5 flex items-baseline gap-3 text-[28px] tracking-[-0.02em]">
                {month.name}
                <span className="font-mono text-[14px] font-normal text-muted">{month.year}</span>
            </h2>
            <ol className="flex flex-col gap-3.5">
                {month.events.map((event) => <TimelineEvent key={event._id} {...event} />)}
            </ol>
        </section>
    ));
};

export default CalendarTimeline;
