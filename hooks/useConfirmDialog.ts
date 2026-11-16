import { useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

type ConfirmAction = {
    request: () => Promise<Response>;
    successMessage: string;
    errorMessage: string;
};

// A native <dialog> that asks before a change, then sends the request and refreshes the page.
// The dialog handles Esc, keeping focus inside and returning it on close.
// Success closes it and shows a toast; an error keeps it open with a message inside it.
export function useConfirmDialog({ request, successMessage, errorMessage }: ConfirmAction) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const open = () => {
        setError(null);
        dialogRef.current?.showModal();
    };
    const close = () => dialogRef.current?.close();

    // The dialog fills the screen, so a click landing on it directly is a click on the backdrop.
    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget && !isPending) close();
    };

    const confirm = async () => {
        setIsPending(true);
        setError(null);
        try {
            const response = await request();
            if (!response.ok) {
                setError(errorMessage);
                return;
            }
            close();
            toast(successMessage);
            router.refresh();
        } catch {
            setError(errorMessage);
        } finally {
            setIsPending(false);
        }
    };

    return { dialogRef, isPending, error, open, close, confirm, handleBackdropClick };
}
