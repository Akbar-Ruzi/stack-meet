import { toast as sonnerToast } from "sonner";
import ToastCard from "@/components/ui/ToastCard";

const PENDING_TOAST_KEY = "stackmeet:pending-toast";

// Shows a success toast. A new one replaces the one on screen, so only one shows at a time.
export function toast(message: string) {
    sonnerToast.dismiss();
    sonnerToast.custom((id) => <ToastCard message={message} onDismiss={() => sonnerToast.dismiss(id)} />);
}

// Keeps a toast for the next page, for when a full page load (window.location.assign)
// would wipe one shown now. PendingToast shows it once that page has loaded.
export function toastAfterPageLoad(message: string) {
    try {
        sessionStorage.setItem(PENDING_TOAST_KEY, message);
    } catch {
        // Storage can be blocked (private mode); the page still works without the toast.
    }
}

// Shows the toast kept by toastAfterPageLoad, once.
export function showPendingToast() {
    let message: string | null = null;
    try {
        message = sessionStorage.getItem(PENDING_TOAST_KEY);
        sessionStorage.removeItem(PENDING_TOAST_KEY);
    } catch {
        return;
    }
    if (message) toast(message);
}
