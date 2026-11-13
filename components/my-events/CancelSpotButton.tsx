"use client";

import { useId } from "react";
import { buttonClasses } from "@/components/ui/Button";
import ConfirmDialog from "@/components/my-events/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { formatMonthDay } from "@/lib/events/display";

type CancelSpotButtonProps = { bookingId: string; title: string; date: string };

const CancelSpotButton = ({ bookingId, title, date }: CancelSpotButtonProps) => {
    const titleId = useId();
    const { dialogRef, isPending, open, close, confirm, handleBackdropClick } = useConfirmDialog({
        request: () => fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "DELETE" }),
        successMessage: `Your spot at "${title}" is cancelled.`,
        errorMessage: "Couldn't cancel your spot. Please try again.",
    });

    return (
        <>
            <button type="button" onClick={open} aria-haspopup="dialog" aria-label={`Cancel my spot at ${title}`} className={buttonClasses({ variant: "danger-outline", size: "md" })}>
                Cancel spot
            </button>
            <ConfirmDialog
                dialogRef={dialogRef}
                titleId={titleId}
                heading="Cancel your spot?"
                keepLabel="Keep my spot"
                confirmLabel="Cancel spot"
                pendingLabel="Canceling..."
                isPending={isPending}
                onKeep={close}
                onConfirm={confirm}
                onBackdropClick={handleBackdropClick}
            >
                You&apos;ll give up your spot at {title} on {formatMonthDay(date)}. The organizer will see one less attendee.
            </ConfirmDialog>
        </>
    );
};

export default CancelSpotButton;
