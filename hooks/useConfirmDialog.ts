import { useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ConfirmAction = {
    request: () => Promise<Response>;
    successMessage: string;
    errorMessage: string;
};

// A native <dialog> that asks before a change, then sends the request and refreshes the page.
// The dialog handles Esc, keeping focus inside and returning it on close.
export function useConfirmDialog({ request, successMessage, errorMessage }: ConfirmAction) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isPending, setIsPending] = useState(false);

    const open = () => dialogRef.current?.showModal();
    const close = () => dialogRef.current?.close();

    // The dialog fills the screen, so a click landing on it directly is a click on the backdrop.
    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget && !isPending) close();
    };

    const confirm = async () => {
        setIsPending(true);
        try {
            const response = await request();
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                toast.error(data?.message ?? errorMessage);
                return;
            }
            close();
            toast.success(successMessage);
            router.refresh();
        } catch {
            toast.error(errorMessage);
        } finally {
            setIsPending(false);
        }
    };

    return { dialogRef, isPending, open, close, confirm, handleBackdropClick };
}
