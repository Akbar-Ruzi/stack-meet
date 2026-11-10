import { useWatch, type Control } from "react-hook-form";
import DateTile from "@/components/ui/DateTile";
import FormatBadge from "@/components/ui/FormatBadge";
import { getEventPlace } from "@/lib/events/display";
import type { EventFormValues } from "@/types/event.types";

const EventPreview = ({ control }: { control: Control<EventFormValues> }) => {
    const [title, date, time, mode, location, tags] = useWatch({
        control,
        name: ["title", "date", "time", "mode", "location", "tags"],
    });
    const placeAndTime = [getEventPlace({ mode, location }), time].filter(Boolean).join(" · ");

    return (
        <aside aria-label="Preview" className="flex max-w-90 flex-[1_1_300px] flex-col gap-3.5">
            <div>
                <h2 className="text-[22px] font-bold tracking-[-0.01em]">Preview</h2>
                <p className="mt-1 text-[14px] text-muted">How your event will look in the Events list.</p>
            </div>
            <div className="flex flex-col gap-4.5 rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                    <DateTile date={date} />
                    <FormatBadge mode={mode} />
                </div>
                <div className="wrap-anywhere">
                    <div className="text-xl font-bold leading-tight tracking-[-0.01em]">{title}</div>
                    <div className="mt-2 text-[14px] text-muted">{placeAndTime}</div>
                    {tags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-2 font-mono text-xs text-muted">
                            {tags.map((tag) => <span key={tag}>#{tag}</span>)}
                        </div>
                    )}
                </div>
                <div className="border-t border-line pt-3.5 font-mono text-[13px] text-accent">view event →</div>
            </div>
            <p className="text-[14px] leading-normal text-muted">Your progress is kept as you move between steps.</p>
        </aside>
    );
};

export default EventPreview;
