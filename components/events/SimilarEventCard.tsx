import Link from "next/link";
import type { EventFields } from "@/types/event.types";
import { FORMAT_LABELS, getDateParts, getEventPlace } from "@/lib/events/display";

type SimilarEventCardProps = Pick<EventFields, "title" | "slug" | "date" | "mode" | "location">;

const SimilarEventCard = ({ title, slug, date, mode, location }: SimilarEventCardProps) => {
    const { month, day, weekday } = getDateParts(date);

    return (
        <Link href={`/events/${slug}`} className="block rounded-[14px] border border-line bg-surface p-5.5">
            <div className="font-mono text-xs text-accent">{month} {day} · {weekday}</div>
            <div className="mt-2 text-xl font-bold">{title}</div>
            <div className="mt-1.5 text-[14px] text-muted">
                {getEventPlace({ mode, location })} · {FORMAT_LABELS[mode]}
            </div>
        </Link>
    );
};

export default SimilarEventCard;
