"use client";

import toast from "react-hot-toast";

export function useCopyPageLink() {
    return async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied.");
        } catch {
            toast.error("Couldn't copy the link. Copy it from the address bar.");
        }
    };
}
