import type { MouseEvent, RefObject } from "react";
import Button from "@/components/ui/Button";

type DeleteEventDialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>;
    titleId: string;
    title: string;
    bookedCount: number;
    isDeleting: boolean;
    onKeep: () => void;
    onConfirm: () => void;
    onBackdropClick: (e: MouseEvent<HTMLDialogElement>) => void;
};

// Asks before deleting an event. On phones the two buttons share one row.
const DeleteEventDialog = ({ dialogRef, titleId, title, bookedCount, isDeleting, onKeep, onConfirm, onBackdropClick }: DeleteEventDialogProps) => (
    <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={onBackdropClick}
        onCancel={(e) => isDeleting && e.preventDefault()}
        className="fixed inset-0 z-40 h-full max-h-none w-full max-w-none items-center justify-center bg-black/65 p-6 text-text backdrop:bg-transparent open:flex"
    >
        <div className="w-full max-w-115 rounded-2xl border border-border bg-surface p-6.5">
            <h2 id={titleId} className="text-[22px] font-bold">Delete {title}?</h2>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-body">
                {bookedCount} {bookedCount === 1 ? "person" : "people"} booked this event. Deleting it removes the event and all its bookings. This can&apos;t be undone.
            </p>
            <div className="mt-5.5 flex flex-wrap justify-end gap-2.5 max-[640px]:flex-nowrap max-[640px]:*:min-w-0 max-[640px]:*:flex-1 max-[640px]:*:whitespace-nowrap max-[640px]:*:px-2.5">
                <Button variant="secondary" size="dialog" onClick={onKeep} disabled={isDeleting}>
                    Keep event
                </Button>
                <Button variant="danger" size="dialog" onClick={onConfirm} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete event"}
                </Button>
            </div>
        </div>
    </dialog>
);

export default DeleteEventDialog;
