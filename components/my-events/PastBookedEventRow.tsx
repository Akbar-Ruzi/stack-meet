import Link from "next/link";
import DateTile from "@/components/ui/DateTile";
import FormatBadge from "@/components/ui/FormatBadge";
import { formatMonthDay, getEventPlace } from "@/lib/events/display";
import { ACTIONS_ROW } from "@/lib/constants";
import type { BookedEvent } from "@/lib/data/my-events";

// One booked event that has ended: faded, with a dashed border and the "Event ended" pill.
// On phones the format badge moves next to the date tile, as on the upcoming rows.
const PastBookedEventRow = ({ booking }: { booking: BookedEvent }) => {
    const { title, slug, date, time, mode, location, bookedOn } = booking;

    return (
        <article className="flex flex-wrap items-center gap-x-5 gap-y-4.5 rounded-2xl border border-dashed border-border bg-bg px-5 py-4.5 text-muted">
            <div className="flex flex-none max-[640px]:flex-[1_1_100%] max-[640px]:items-start max-[640px]:justify-between">
                <DateTile date={date} muted />
                <FormatBadge mode={mode} muted className="hidden px-2.5 py-1.5 font-mono text-xs max-[640px]:inline-block" />
            </div>
            <div className="min-w-0 flex-[1_1_260px]">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-medium tracking-[-0.01em] text-body">{title}</h2>
                    <FormatBadge mode={mode} muted className="px-2.25 py-0.75 font-mono text-xs max-[640px]:hidden" />
                </div>
                <div className="mt-1.5 text-[14px]">{getEventPlace({ mode, location })} · {time}</div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[13px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-text px-3 py-1.25 font-bold text-bg">
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                        </svg>
                        Event ended
                    </span>
                    <span>You booked a spot · {formatMonthDay(bookedOn)}</span>
                </div>
            </div>
            <div className={ACTIONS_ROW}>
                <Link href={`/events/${slug}`} className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-3.5 text-sm text-body">
                    View event
                </Link>
            </div>
        </article>
    );
};

export default PastBookedEventRow;
