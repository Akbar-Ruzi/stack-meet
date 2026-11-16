"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

const COPY_FAILED_MESSAGE = "Couldn't copy the link. Copy it from the address bar.";

// Copies the page's URL. Success shows a toast; a failure returns a message to show
// next to the button, which clears on the next successful copy.
export function useCopyPageLink() {
    const [error, setError] = useState<string | null>(null);

    const copyPageLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setError(null);
            toast("Link copied");
        } catch {
            setError(COPY_FAILED_MESSAGE);
        }
    };

    return { copyPageLink, error };
}
