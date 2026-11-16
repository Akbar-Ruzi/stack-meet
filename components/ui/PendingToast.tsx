"use client";

import { useEffect } from "react";
import { showPendingToast } from "@/lib/toast";

// Shows a toast that the previous page kept for after its full page load. Renders nothing.
// It comes after the Toaster in the layout, so the Toaster is listening when this runs.
const PendingToast = () => {
    useEffect(() => {
        showPendingToast();
    }, []);

    return null;
};

export default PendingToast;
