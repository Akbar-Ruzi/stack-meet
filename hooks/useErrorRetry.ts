"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

// reset() alone only re-renders on the client. The failed part is a Server Component,
// so router.refresh() asks the server to render it again, and reset() clears the error.
export function useErrorRetry(reset: () => void) {
    const router = useRouter();
    const [isRetrying, startTransition] = useTransition();

    const retry = () => {
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    return { retry, isRetrying };
}
