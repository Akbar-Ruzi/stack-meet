import TimelineEvent from "@/components/calendar/TimelineEvent";
import { getUpcomingEvents, type EventRecord } from "@/lib/data/events";
import { groupEventsByMonth } from "@/lib/events/calendar";

// Every upcoming event, soonest first, grouped by month.
const CalendarTimeline = async () => {
    const events = await getUpcomingEvents().catch((error): EventRecord[] => {
        console.error("Loading the calendar events failed:", error);
        return [];
    });

    if (events.length === 0) return <p className="text-muted">No upcoming events yet.</p>;

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
