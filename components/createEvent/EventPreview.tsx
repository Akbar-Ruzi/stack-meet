import { useWatch, type UseFormReturn } from "react-hook-form";
import EventPreviewDialog from "@/components/createEvent/EventPreviewDialog";
import DateTile from "@/components/ui/DateTile";
import FormatBadge from "@/components/ui/FormatBadge";
import { useEventPreviewDialog } from "@/hooks/useEventPreviewDialog";
import { getEventPlace } from "@/lib/events/display";
import type { EventFormValues } from "@/types/event.types";

const EventPreview = ({ form }: { form: UseFormReturn<EventFormValues> }) => {
    const [title, date, time, mode, location, tags] = useWatch({
        control: form.control,
        name: ["title", "date", "time", "mode", "location", "tags"],
    });
    const { dialogRef, preview, open, close, handleClosed, handleBackdropClick } = useEventPreviewDialog(() => form.getValues());
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
            </div>
            <button
                type="button"
                onClick={open}
                aria-haspopup="dialog"
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-accent text-[15px] font-bold text-accent"
            >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                View event
            </button>
            <p className="text-[14px] leading-normal text-muted">See the full event page before you publish. Your progress is kept as you move between steps.</p>

            <EventPreviewDialog
                dialogRef={dialogRef}
                preview={preview}
                onClose={close}
                onClosed={handleClosed}
                onBackdropClick={handleBackdropClick}
            />
        </aside>
    );
};

export default EventPreview;
