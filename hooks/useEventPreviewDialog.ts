import { useRef, useState, type MouseEvent } from "react";
import type { EventFormValues } from "@/types/event.types";

type OpenPreview = { values: EventFormValues; coverUrl: string | null };

// The native <dialog> handles Esc, keeping focus inside and returning it on close.
export function useEventPreviewDialog(getValues: () => EventFormValues) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [preview, setPreview] = useState<OpenPreview | null>(null);

    const open = () => {
        const values = getValues();
        const file = values.image?.[0];
        setPreview({ values, coverUrl: file ? URL.createObjectURL(file) : null });
        dialogRef.current?.showModal();
    };

    const close = () => dialogRef.current?.close();

    // Runs however the dialog was closed: the button, the backdrop or Esc.
    const handleClosed = () => {
        if (preview?.coverUrl) URL.revokeObjectURL(preview.coverUrl);
        setPreview(null);
    };

    // The dialog fills the screen, so a click landing on it directly is a click on the backdrop.
    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) close();
    };

    return { dialogRef, preview, open, close, handleClosed, handleBackdropClick };
}
