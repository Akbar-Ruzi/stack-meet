import { getDateParts } from "@/lib/events/display";

// muted: the faded tile on past bookings.
const DateTile = ({ date, muted = false }: { date: string; muted?: boolean }) => {
    const { month, day, weekday } = getDateParts(date);

    return (
        <div className={`w-16 flex-none rounded-[12px] border py-2 text-center font-mono ${muted ? "border-line bg-surface" : "border-border bg-bg"}`}>
            <div className={`text-[11px] ${muted ? "text-muted" : "text-accent"}`}>{month}</div>
            <div className={`text-[26px] font-medium leading-[1.2] ${muted ? "text-muted" : ""}`}>{day}</div>
            <div className="text-[10px] text-muted">{weekday}</div>
        </div>
    );
};

export default DateTile;
