"use client";

import { useId } from "react";
import { buttonClasses } from "@/components/ui/Button";
import ConfirmDialog from "@/components/my-events/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

type DeleteEventButtonProps = { slug: string; title: string; bookedCount: number };

const DeleteEventButton = ({ slug, title, bookedCount }: DeleteEventButtonProps) => {
    const titleId = useId();
    const { dialogRef, isPending, open, close, confirm, handleBackdropClick } = useConfirmDialog({
        request: () => fetch(`/api/events/${encodeURIComponent(slug)}`, { method: "DELETE" }),
        successMessage: `Deleted "${title}".`,
        errorMessage: "Couldn't delete the event. Please try again.",
    });

    return (
        <>
            <button type="button" onClick={open} aria-haspopup="dialog" aria-label={`Delete ${title}`} className={buttonClasses({ variant: "danger-outline", size: "md" })}>
                Delete
            </button>
            <ConfirmDialog
                dialogRef={dialogRef}
                titleId={titleId}
                heading={`Delete ${title}?`}
                keepLabel="Keep event"
                confirmLabel="Delete event"
                pendingLabel="Deleting..."
                isPending={isPending}
                onKeep={close}
                onConfirm={confirm}
                onBackdropClick={handleBackdropClick}
            >
                {bookedCount} {bookedCount === 1 ? "person" : "people"} booked this event. Deleting it removes the event and all its bookings. This can&apos;t be undone.
            </ConfirmDialog>
        </>
    );
};

export default DeleteEventButton;
