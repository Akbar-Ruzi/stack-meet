import { Toaster as SonnerToaster } from "sonner";

// Where toasts appear. One at a time, under the sticky header. The position, size and
// animation are in globals.css, because sonner's own layout differs from the design.
const Toaster = () => <SonnerToaster position="top-center" visibleToasts={1} swipeDirections={[]} />;

export default Toaster;
