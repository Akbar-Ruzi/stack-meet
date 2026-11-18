import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

const ERROR_MESSAGE = "Couldn't remove. Please try again.";

// Hides a past booking from the Booked list, with no dialog. Success shows a toast and refreshes
// the page so the row leaves the list; an error keeps the row and returns a message to show under it.
export function useRemovePastBooking({ bookingId, title }: { bookingId: string; title: string }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async () => {
        if (isPending) return;
        setIsPending(true);
        setError(null);
        try {
            const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "PATCH" });
            if (!response.ok) {
                setError(ERROR_MESSAGE);
                return;
            }
            toast(`Removed “${title}” from your list.`);
            router.refresh();
        } catch {
            setError(ERROR_MESSAGE);
        } finally {
            setIsPending(false);
        }
    };

    return { isPending, error, remove };
}
