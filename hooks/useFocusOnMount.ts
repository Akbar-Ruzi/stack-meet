"use client";

import { useEffect, useRef } from "react";

// Moves focus to the element once it appears, so screen readers and keyboard users land on it.
// The element needs tabIndex={-1} to take focus.
export function useFocusOnMount<T extends HTMLElement>(enabled = true) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (enabled) ref.current?.focus();
    }, [enabled]);

    return ref;
}
