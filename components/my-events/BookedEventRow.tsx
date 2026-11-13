import Link from "next/link";
import DateTile from "@/components/ui/DateTile";
import FormatBadge from "@/components/ui/FormatBadge";
import CancelSpotButton from "@/components/my-events/CancelSpotButton";
import { formatMonthDay, getEventPlace } from "@/lib/events/display";
import { ACTIONS_ROW } from "@/lib/constants";
import type { BookedEvent } from "@/lib/data/my-events";

const CheckIcon = () => (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
    </svg>
);

// One upcoming event the user booked. On phones the format badge moves next to the date tile.
const BookedEventRow = ({ booking }: { booking: BookedEvent }) => {
    const { bookingId, title, slug, date, time, mode, location, bookedOn } = booking;

    return (
        <article className="flex flex-wrap items-center gap-x-5 gap-y-4.5 rounded-2xl border border-line bg-surface px-5 py-4.5">
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
                <div className="mt-2 flex items-center gap-2 text-[13px] text-[#9BE15D]">
                    <CheckIcon />
                    Spot reserved · booked {formatMonthDay(bookedOn)}
                </div>
            </div>
            <div className={ACTIONS_ROW}>
                <Link href={`/events/${slug}`} className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-3.5 text-sm text-text">
                    View event
                </Link>
                <CancelSpotButton bookingId={bookingId} title={title} date={date} />
            </div>
        </article>
    );
};

export default BookedEventRow;
