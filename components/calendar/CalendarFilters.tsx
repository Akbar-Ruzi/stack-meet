"use client";

import { useCalendarFilters } from "@/hooks/useCalendarFilters";
import { FORMAT_LABELS } from "@/lib/events/display";
import type { EventMode } from "@/lib/events/search";

const FORMATS: EventMode[] = ["online", "in-person", "hybrid"];
const LEGEND_CLASSES = "font-mono text-xs text-muted";

// The sidebar: format, topics and city. Changes update the URL, and the server sends the matching events.
const CalendarFilters = ({ topics }: { topics: string[] }) => {
    const { filters, isFormatChecked, toggleFormat, toggleTopic, setCity, clear } = useCalendarFilters();

    return (
        <aside aria-label="Filters" className="flex max-w-72.5 flex-[1_1_250px] flex-col gap-6.5 rounded-2xl border border-line bg-surface p-6">
            <fieldset className="flex flex-col gap-0.5">
                <legend className={`mb-2 ${LEGEND_CLASSES}`}>format</legend>
                {FORMATS.map((mode) => (
                    <label key={mode} className="flex min-h-10 items-center gap-2.5 text-[15px]">
                        <input
                            type="checkbox"
                            checked={isFormatChecked(mode)}
                            onChange={() => toggleFormat(mode)}
                            className="size-4.5 accent-accent"
                        />
                        {FORMAT_LABELS[mode]}
                    </label>
                ))}
            </fieldset>

            {topics.length > 0 && (
                <fieldset>
                    <legend className={`mb-3 ${LEGEND_CLASSES}`}>topics</legend>
                    <div className="flex flex-wrap gap-2 font-mono text-[13px]">
                        {topics.map((topic) => (
                            <label
                                key={topic}
                                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 has-checked:border-accent"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.topics.includes(topic)}
                                    onChange={() => toggleTopic(topic)}
                                    className="accent-accent"
                                />
                                #{topic}
                            </label>
                        ))}
                    </div>
                </fieldset>
            )}

            <label className={`flex flex-col gap-2 ${LEGEND_CLASSES}`}>
                city
                <input
                    type="text"
                    value={filters.city ?? ""}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Washington, DC"
                    className="h-11.5 rounded-[10px] border border-border bg-field px-3.5 font-sans text-[15px] text-text placeholder:text-muted"
                />
            </label>

            <button
                type="button"
                onClick={clear}
                className="min-h-11 cursor-pointer rounded-[10px] border border-border bg-transparent font-mono text-[13px] font-medium text-text"
            >
                clear filters
            </button>
        </aside>
    );
};

export default CalendarFilters;
