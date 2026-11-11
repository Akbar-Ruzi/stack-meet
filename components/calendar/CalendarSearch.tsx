import Form from "next/form";
import Link from "next/link";
import type { CalendarSearch as Search } from "@/lib/events/calendar";
import { calendarHref } from "@/lib/url/calendar-query";

type CalendarSearchProps = {
    search?: Search;
    count?: number; // How many events match, shown while a search is active
};

// A GET form: Enter or the button loads /calendar?q=… without a full page reload.
// Hidden fields keep the sidebar filters.
const CalendarSearch = ({ search, count }: CalendarSearchProps) => {
    const q = search?.q;

    return (
        <Form
            action="/calendar"
            scroll={false}
            role="search"
            aria-label="Search events"
            className="flex max-w-130 flex-[1_1_360px] flex-wrap items-end gap-2.5"
        >
            <label className="flex flex-[1_1_200px] flex-col gap-2 font-mono text-xs text-muted">
                search
                <input
                    key={q}
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Event, topic or city"
                    className="h-12.5 rounded-[10px] border border-border bg-field px-4 font-sans text-base text-text placeholder:text-muted"
                />
            </label>
            <button type="submit" aria-label="Search" className="flex size-12.5 cursor-pointer items-center justify-center rounded-[10px] bg-accent">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-on-accent">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                </svg>
            </button>

            {search?.formats && <input type="hidden" name="format" value="" />}
            {search?.formats?.map((format) => <input key={format} type="hidden" name="format" value={format} />)}
            {search?.topics.map((topic) => <input key={topic} type="hidden" name="topic" value={topic} />)}
            {search?.city && <input type="hidden" name="city" value={search.city} />}

            {q && count !== undefined && (
                <div className="flex basis-full flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
                    <p role="status" className={`flex items-center gap-2 text-[15px] ${count === 0 ? "font-bold text-text" : "text-muted"}`}>
                        {count === 0 && (
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8v5M12 16v.01" />
                            </svg>
                        )}
                        {count === 0
                            ? "No events match your search."
                            : `${count} ${count === 1 ? "event matches" : "events match"} “${q}”.`}
                    </p>
                    <Link
                        href={calendarHref({ ...search, q: undefined })}
                        scroll={false}
                        className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-border px-4.5 text-[15px] font-medium text-text max-[641px]:flex-[1_1_100%]"
                    >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                        Clear search
                    </Link>
                </div>
            )}
        </Form>
    );
};

// Fills the box and the status row once the URL and the matching events are known.
export const CalendarSearchWithValues = async ({ search, events }: { search: Promise<Search>; events: Promise<unknown[]> }) => {
    const [values, matches] = await Promise.all([search, events]);
    return <CalendarSearch search={values} count={matches.length} />;
};

export default CalendarSearch;
