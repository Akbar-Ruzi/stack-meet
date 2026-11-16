import { toast as sonnerToast } from "sonner";
import ToastCard from "@/components/ui/ToastCard";

// Shows a success toast. A new one replaces the one on screen, so only one shows at a time.
export function toast(message: string) {
    sonnerToast.dismiss();
    sonnerToast.custom((id) => <ToastCard message={message} onDismiss={() => sonnerToast.dismiss(id)} />);
}
