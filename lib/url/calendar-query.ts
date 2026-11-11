import { firstParam, isEventMode, type EventMode } from "@/lib/events/search";
import type { CalendarSearch } from "@/lib/events/calendar";

export type CalendarSearchParams = Record<string, string | string[] | undefined>;

const ALL_FORMATS: EventMode[] = ["online", "in-person", "hybrid"];

const allParams = (value: string | string[] | undefined) =>
    value === undefined ? undefined : Array.isArray(value) ? value : [value];

// Turns /calendar?q=…&format=…&topic=…&city=… into a search.
// The filter form always sends an empty "format", so a missing "format" means every format
// and a present but empty one means the user unticked them all.
export function parseCalendarQuery(params: CalendarSearchParams): CalendarSearch {
    const formatValues = allParams(params.format);
    const formats = formatValues && [...new Set(formatValues.filter(isEventMode))];

    return {
        q: firstParam(params.q)?.trim() || undefined,
        formats: formats && formats.length < ALL_FORMATS.length ? formats : undefined,
        topics: [...new Set((allParams(params.topic) ?? []).map((topic) => topic.trim()).filter(Boolean))],
        city: firstParam(params.city)?.trim() || undefined,
    };
}

// URLSearchParams to the same shape Next.js gives a page, keeping repeated keys like ?topic=a&topic=b.
export function toSearchParamsRecord(params: URLSearchParams): CalendarSearchParams {
    const record: Record<string, string[]> = {};
    params.forEach((value, key) => {
        (record[key] ??= []).push(value);
    });
    return record;
}

// The /calendar URL for a search, used by the filters and the clear links.
export function calendarHref({ q, formats, topics, city }: CalendarSearch): string {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (formats) {
        params.append("format", "");
        formats.forEach((format) => params.append("format", format));
    }
    topics.forEach((topic) => params.append("topic", topic));
    if (city) params.set("city", city);

    const query = params.toString();
    return query ? `/calendar?${query}` : "/calendar";
}
