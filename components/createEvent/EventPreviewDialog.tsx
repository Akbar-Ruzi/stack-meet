import type { MouseEvent, RefObject } from "react";
import EventPagePreview from "@/components/createEvent/EventPagePreview";
import type { EventFormValues } from "@/types/event.types";

const TITLE_ID = "event-preview-title";

type EventPreviewDialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>;
    preview: { values: EventFormValues; coverUrl: string | null } | null;
    onClose: () => void;
    onClosed: () => void;
    onBackdropClick: (e: MouseEvent<HTMLDialogElement>) => void;
};

const EventPreviewDialog = ({ dialogRef, preview, onClose, onClosed, onBackdropClick }: EventPreviewDialogProps) => (
    <dialog
        ref={dialogRef}
        aria-labelledby={TITLE_ID}
        onClose={onClosed}
        onClick={onBackdropClick}
        className="fixed inset-0 z-40 h-full max-h-none w-full max-w-none items-center justify-center bg-black/72 p-8 text-text backdrop:bg-transparent open:flex max-sm:p-0"
    >
        <div className="max-h-full w-full max-w-220 overflow-y-auto rounded-[20px] border border-border bg-bg shadow-[0_24px_64px_rgba(0,0,0,0.6)] max-sm:h-full max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none max-sm:border-0">
            <div className="sticky top-0 z-1 flex items-center justify-between gap-4 border-b border-line bg-bg/94 py-3 pl-6 pr-4">
                <span className="flex min-w-0 items-center gap-2.5 font-mono text-[13px] text-muted">
                    <span className="whitespace-nowrap rounded-full border border-dashed border-accent px-2.5 py-1 text-accent">preview</span>
                    <span className="truncate">not published yet — only you can see this</span>
                </span>
                <button type="button" onClick={onClose} aria-label="Close preview" className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-border bg-field text-text">
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
            </div>
            {preview && <EventPagePreview titleId={TITLE_ID} values={preview.values} coverUrl={preview.coverUrl} />}
        </div>
    </dialog>
);

export default EventPreviewDialog;
