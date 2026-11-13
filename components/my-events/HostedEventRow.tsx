import Link from "next/link";
import DateTile from "@/components/ui/DateTile";
import FormatBadge from "@/components/ui/FormatBadge";
import { buttonClasses } from "@/components/ui/Button";
import DeleteEventButton from "@/components/my-events/DeleteEventButton";
import { getEventPlace } from "@/lib/events/display";
import { ACTIONS_ROW } from "@/lib/constants";
import type { HostedEvent } from "@/lib/data/my-events";

const EditIcon = () => (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h4L19 9l-4-4L4 16z" />
    </svg>
);

// One event the user created. On phones the format badge moves next to the date tile.
const HostedEventRow = ({ event }: { event: HostedEvent }) => {
    const { title, slug, date, time, mode, location, bookedCount, isUpcoming } = event;

    return (
        <article className={`flex flex-wrap items-center gap-x-5 gap-y-4.5 rounded-2xl border border-line bg-surface px-5 py-4.5 ${isUpcoming ? "" : "opacity-75"}`}>
            <div className="flex flex-none max-[640px]:flex-[1_1_100%] max-[640px]:items-start max-[640px]:justify-between">
                <DateTile date={date} />
                <FormatBadge mode={mode} className="hidden px-2.5 py-1.5 font-mono text-xs max-[640px]:inline-block" />
            </div>
            <div className="min-w-0 flex-[1_1_260px]">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold tracking-[-0.01em]">{title}</h2>
                    <FormatBadge mode={mode} className="px-2.25 py-0.75 font-mono text-xs max-[640px]:hidden" />
                </div>
                <div className="mt-1.5 text-[14px] text-muted">{getEventPlace({ mode, location })} · {time}</div>
                <div className="mt-2 flex flex-wrap gap-3.5 font-mono text-[13px]">
                    <span><strong className="text-text">{bookedCount}</strong> <span className="text-muted">booked</span></span>
                    <span className={isUpcoming ? "text-[#9BE15D]" : "text-muted"}>{isUpcoming ? "upcoming" : "ended"}</span>
                </div>
            </div>
            <div className={ACTIONS_ROW}>
                <Link href={`/events/${slug}`} className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-3.5 text-sm text-text">
                    View
                </Link>
                {isUpcoming && (
                    <Link href={`/events/${slug}/edit`} className={buttonClasses({ variant: "accent-outline", size: "md", className: "gap-1.5" })}>
                        <EditIcon />
                        Edit
                    </Link>
                )}
                <DeleteEventButton slug={slug} title={title} bookedCount={bookedCount} />
            </div>
        </article>
    );
};

export default HostedEventRow;
