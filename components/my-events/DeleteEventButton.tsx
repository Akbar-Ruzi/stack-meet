"use client";

import { useId } from "react";
import { buttonClasses } from "@/components/ui/Button";
import DeleteEventDialog from "@/components/my-events/DeleteEventDialog";
import { useDeleteEventDialog } from "@/hooks/useDeleteEventDialog";

type DeleteEventButtonProps = { slug: string; title: string; bookedCount: number };

const DeleteEventButton = ({ slug, title, bookedCount }: DeleteEventButtonProps) => {
    const titleId = useId();
    const { dialogRef, isDeleting, open, close, confirm, handleBackdropClick } = useDeleteEventDialog({ slug, title });

    return (
        <>
            <button type="button" onClick={open} aria-haspopup="dialog" aria-label={`Delete ${title}`} className={buttonClasses({ variant: "danger-outline", size: "md" })}>
                Delete
            </button>
            <DeleteEventDialog
                dialogRef={dialogRef}
                titleId={titleId}
                title={title}
                bookedCount={bookedCount}
                isDeleting={isDeleting}
                onKeep={close}
                onConfirm={confirm}
                onBackdropClick={handleBackdropClick}
            />
        </>
    );
};

export default DeleteEventButton;
