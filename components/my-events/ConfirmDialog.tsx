import type { MouseEvent, ReactNode, RefObject } from "react";
import Button from "@/components/ui/Button";

type ConfirmDialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>;
    titleId: string;
    heading: string;
    children: ReactNode;
    keepLabel: string;
    confirmLabel: string;
    pendingLabel: string;
    isPending: boolean;
    onKeep: () => void;
    onConfirm: () => void;
    onBackdropClick: (e: MouseEvent<HTMLDialogElement>) => void;
};

// Asks before a change that can't be undone. On phones the two buttons share one row.
const ConfirmDialog = ({ dialogRef, titleId, heading, children, keepLabel, confirmLabel, pendingLabel, isPending, onKeep, onConfirm, onBackdropClick }: ConfirmDialogProps) => (
    <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={onBackdropClick}
        onCancel={(e) => isPending && e.preventDefault()}
        className="fixed inset-0 z-40 h-full max-h-none w-full max-w-none items-center justify-center bg-black/65 p-6 text-text backdrop:bg-transparent open:flex"
    >
        <div className="w-full max-w-115 rounded-2xl border border-border bg-surface p-6.5">
            <h2 id={titleId} className="text-[22px] font-bold">{heading}</h2>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-body">{children}</p>
            <div className="mt-5.5 flex flex-wrap justify-end gap-2.5 max-[640px]:flex-nowrap max-[640px]:*:min-w-0 max-[640px]:*:flex-1 max-[640px]:*:whitespace-nowrap max-[640px]:*:px-2.5">
                <Button variant="secondary" size="dialog" onClick={onKeep} disabled={isPending}>
                    {keepLabel}
                </Button>
                <Button variant="danger" size="dialog" onClick={onConfirm} disabled={isPending}>
                    {isPending ? pendingLabel : confirmLabel}
                </Button>
            </div>
        </div>
    </dialog>
);

export default ConfirmDialog;
