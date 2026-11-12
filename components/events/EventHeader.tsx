import Link from "next/link";
import FormatBadge from "@/components/ui/FormatBadge";
import { formatFullDate } from "@/lib/events/display";
import { PILL_CLASSES } from "@/lib/constants";
import type { EventFields } from "@/types/event.types";

// On phones the date and time share the first row equally, and the badge and tags start the next one.
const WHEN_PILL_CLASSES = `${PILL_CLASSES} max-[641px]:flex-[1_1_calc(50%-5px)] max-[641px]:whitespace-nowrap max-[641px]:px-1.5 max-[641px]:text-center max-[641px]:text-xs`;

type EventHeaderProps = Pick<EventFields, "title" | "slug" | "description" | "date" | "time" | "mode" | "tags">;

const EventHeader = ({ title, slug, description, date, time, mode, tags }: EventHeaderProps) => (
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
            {tags?.map((tag) => <span key={tag} className={PILL_CLASSES}>#{tag}</span>)}
        </div>
    </section>
);

export default EventHeader;
