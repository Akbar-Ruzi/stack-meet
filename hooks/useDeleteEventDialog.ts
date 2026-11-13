import { useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// The native <dialog> handles Esc, keeping focus inside and returning it on close.
export function useDeleteEventDialog({ slug, title }: { slug: string; title: string }) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const open = () => dialogRef.current?.showModal();
    const close = () => dialogRef.current?.close();

    // The dialog fills the screen, so a click landing on it directly is a click on the backdrop.
    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget && !isDeleting) close();
    };

    const confirm = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/events/${encodeURIComponent(slug)}`, { method: "DELETE" });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                toast.error(data?.message ?? "Couldn't delete the event. Please try again.");
                return;
            }
            close();
            toast.success(`Deleted "${title}".`);
            router.refresh();
        } catch {
            toast.error("Couldn't delete the event. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return { dialogRef, isDeleting, open, close, confirm, handleBackdropClick };
}
