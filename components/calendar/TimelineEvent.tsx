import Link from "next/link";
import FormatBadge from "@/components/ui/FormatBadge";
import { getDateParts, getEventPlace } from "@/lib/events/display";
import type { EventFields } from "@/types/event.types";

type TimelineEventProps = Pick<EventFields, "title" | "slug" | "date" | "time" | "mode" | "location" | "tags">;

// One row of the calendar: the date, the dot and line, then the event card.
const TimelineEvent = ({ title, slug, date, time, mode, location, tags }: TimelineEventProps) => {
    const { day, weekday } = getDateParts(date);

    return (
        <li className="flex items-stretch gap-5 max-[641px]:gap-2.5">
            <div className="w-15 flex-none pt-4.5 text-right font-mono max-[641px]:w-8.5 max-[641px]:pt-4">
                <div className="text-xs text-muted max-[641px]:text-[10px]">{weekday}</div>
                <div className="text-[26px] font-medium leading-[1.1] max-[641px]:text-xl">{day}</div>
            </div>

            <div aria-hidden="true" className="flex w-3 flex-none flex-col items-center">
                <span className="mt-6 size-3 rounded-full border-2 border-accent bg-bg" />
                <span className="mt-1.5 w-px flex-1 bg-border" />
            </div>

            <Link
                href={`/events/${slug}`}
                className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-4 rounded-[14px] border border-line bg-surface px-5.5 py-5 max-[641px]:p-4"
            >
                <div className="min-w-0 flex-[1_1_260px]">
                    <div className="text-xl font-bold">{title}</div>
                    <div className="mt-1.5 text-[14px] text-muted">{time} · {getEventPlace({ mode, location })}</div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-xs">
                        <FormatBadge mode={mode} className="px-2.5 py-1" />
                        {tags?.map((tag) => <span key={tag} className="text-muted">#{tag}</span>)}
                    </div>
                </div>
                <span className="rounded-lg bg-accent px-4.5 py-2.75 text-[14px] font-bold text-on-accent max-[641px]:flex max-[641px]:min-h-11 max-[641px]:flex-[1_1_100%] max-[641px]:items-center max-[641px]:justify-center">
                    Book
                </span>
            </Link>
        </li>
    );
};

export default TimelineEvent;
