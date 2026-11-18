import { Toaster as SonnerToaster } from "sonner";

// Every toast hides after 2 seconds. The ✕ closes it sooner.
const TOAST_DURATION_MS = 2000;

// Where toasts appear. One at a time, under the sticky header. The position, size and
// animation are in globals.css, because sonner's own layout differs from the design.
const Toaster = () => (
    <SonnerToaster position="top-center" visibleToasts={1} swipeDirections={[]} duration={TOAST_DURATION_MS} />
);

export default Toaster;
