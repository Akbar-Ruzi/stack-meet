import type { EventFields } from "@/database";

export type EventSearch = { q?: string; where?: string };

type SearchableEvent = Pick<EventFields, "title" | "location" | "mode" | "tags">;

const clean = (value?: string) => value?.trim().toLowerCase().replace(/^#/, "") ?? "";

// "what" matches the title or a tag. "where" matches the city, and "online" also
// matches online and hybrid events.
export function filterEvents<T extends SearchableEvent>(events: T[], { q, where }: EventSearch): T[] {
    const what = clean(q);
    const place = clean(where);

    return events.filter((event) => {
        const matchesWhat =
            !what ||
            event.title.toLowerCase().includes(what) ||
            (event.tags ?? []).some((tag) => tag.toLowerCase().includes(what));

        const matchesWhere =
            !place ||
            (place === "online"
                ? event.mode !== "in-person"
                : (event.location ?? "").toLowerCase().includes(place));

        return matchesWhat && matchesWhere;
    });
}

export type EventFormat = EventFields["mode"];

export const isEventFormat = (value?: string): value is EventFormat =>
    value === "online" || value === "in-person" || value === "hybrid";

type DatedEvent = Pick<EventFields, "date" | "time">;

// Events from today on, soonest first. Dates are YYYY-MM-DD and times HH:MM, so plain
// string comparison sorts them correctly.
export function getUpcomingEvents<T extends DatedEvent>(events: T[], today = new Date().toISOString().slice(0, 10)): T[] {
    return events
        .filter((event) => event.date >= today)
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

// Search params can arrive as a string or an array, so keep only the first string.
export const firstParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
