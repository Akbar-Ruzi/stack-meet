import Link from "next/link";
import FormatBadge from "@/components/ui/FormatBadge";
import { formatFullDate } from "@/lib/events/display";
import { PILL_CLASSES } from "@/lib/constants";
import type { EventFields } from "@/types/event.types";

// On phones the date and time share the first row equally, and the badge and tags start the next one.
const WHEN_PILL_CLASSES = `${PILL_CLASSES} max-[641px]:flex-[1_1_calc(50%-5px)] max-[641px]:whitespace-nowrap max-[641px]:px-1.5 max-[641px]:text-center max-[641px]:text-xs`;

type EventHeaderProps = Pick<EventFields, "title" | "slug" | "description" | "date" | "time" | "mode" | "tags"> & {
    ended: boolean; // adds the "Event ended" pill after the format badge
};

const EventHeader = ({ title, slug, description, date, time, mode, tags, ended }: EventHeaderProps) => (
    <section className="mx-auto max-w-300 px-6 pb-8 pt-12 wrap-anywhere">
        <nav aria-label="Breadcrumb" className="font-mono text-[13px] text-muted">
            <Link href="/" className="underline">events</Link> / <span>{slug}</span>
        </nav>

        <h1 className="mt-5 bg-none text-[clamp(40px,5.5vw,68px)] font-bold leading-[1.02] tracking-[-0.03em] text-text">
            {title}
        </h1>

        <p className="mt-4 max-w-170 text-xl leading-normal text-muted">{description}</p>

        <div className="mt-6 flex flex-wrap gap-2.5 font-mono text-[13px]">
            <span className={WHEN_PILL_CLASSES}>{formatFullDate(date)}</span>
            <span className={WHEN_PILL_CLASSES}>{time}</span>
            <FormatBadge mode={mode} className="px-3 py-2" />
            {ended && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-text px-3 py-2 font-bold text-bg">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                    </svg>
                    Event ended
                </span>
            )}
            {tags?.map((tag) => <span key={tag} className={PILL_CLASSES}>#{tag}</span>)}
        </div>
    </section>
);

export default EventHeader;
