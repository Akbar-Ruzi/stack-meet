import type { EventFields } from "@/types/event.types";

export type CalendarMonth<T> = {
    key: string; // "2026-11", unique per month
    name: string; // "November"
    year: string; // "2026"
    events: T[];
};

// Groups events that are already sorted by date into months, keeping their order.
// Dates are YYYY-MM-DD, so the month comes from the string and no timezone can shift it.
export function groupEventsByMonth<T extends Pick<EventFields, "date">>(events: T[]): CalendarMonth<T>[] {
    const months: CalendarMonth<T>[] = [];

    for (const event of events) {
        const key = event.date.slice(0, 7);
        let month = months.at(-1); // Retrieves the last month group in the array

        if (month?.key !== key) {
            const name = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(
                new Date(`${key}-01T00:00:00Z`),
            );
            month = { key, name, year: key.slice(0, 4), events: [] };
            months.push(month);
        }

        month.events.push(event);
    }

    return months;
}
