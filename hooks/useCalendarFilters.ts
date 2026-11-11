"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CalendarSearch } from "@/lib/events/calendar";
import type { EventMode } from "@/lib/events/search";
import { calendarHref, parseCalendarQuery, toSearchParamsRecord } from "@/lib/url/calendar-query";

const ALL_FORMATS: EventMode[] = ["online", "in-person", "hybrid"];
const CITY_DELAY_MS = 400;

type Filters = Omit<CalendarSearch, "q">;

// The sidebar filters live in the URL. They're kept in local state too, so a tick or a typed
// letter shows at once, and they re-sync only when the URL changes from somewhere else,
// such as a "clear" link.
export function useCalendarFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlKey = searchParams.toString();
    const urlSearch = parseCalendarQuery(toSearchParamsRecord(searchParams));

    const [filters, setFilters] = useState<Filters>(urlSearch);
    const [syncedKey, setSyncedKey] = useState(urlKey);
    const [pushedKey, setPushedKey] = useState(urlKey); // The last URL this hook wrote
    const cityTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(cityTimer.current), []);

    // A URL this hook didn't write: take the filters from it.
    if (urlKey !== syncedKey) {
        setSyncedKey(urlKey);
        if (urlKey !== pushedKey) setFilters(urlSearch);
    }

    const push = (next: Filters) => {
        const href = calendarHref({ ...next, q: urlSearch.q });
        setPushedKey(href.split("?")[1] ?? "");
        router.replace(href, { scroll: false });
    };

    const apply = (next: Filters) => {
        clearTimeout(cityTimer.current);
        setFilters(next);
        push(next);
    };

    const isFormatChecked = (mode: EventMode) => !filters.formats || filters.formats.includes(mode);

    const toggleFormat = (mode: EventMode) => {
        const checked = ALL_FORMATS.filter((m) => (m === mode ? !isFormatChecked(m) : isFormatChecked(m)));
        apply({ ...filters, formats: checked.length === ALL_FORMATS.length ? undefined : checked });
    };

    const toggleTopic = (topic: string) => {
        const topics = filters.topics.includes(topic)
            ? filters.topics.filter((t) => t !== topic)
            : [...filters.topics, topic];
        apply({ ...filters, topics });
    };

    // Typing updates the field at once, and the URL after a short pause.
    const setCity = (city: string) => {
        const next = { ...filters, city: city || undefined };
        setFilters(next);
        clearTimeout(cityTimer.current);
        cityTimer.current = setTimeout(() => push({ ...next, city: city.trim() || undefined }), CITY_DELAY_MS);
    };

    const clear = () => apply({ formats: undefined, topics: [], city: undefined });

    return { filters, isFormatChecked, toggleFormat, toggleTopic, setCity, clear };
}
