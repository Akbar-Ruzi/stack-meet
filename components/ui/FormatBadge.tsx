import type { EventFields } from "@/types/event.types";
import { FORMAT_LABELS } from "@/lib/events/display";

const FORMAT_COLORS: Record<EventFields["mode"], string> = {
    online: "border-format-online bg-format-online",
    "in-person": "border-format-in-person bg-format-in-person",
    hybrid: "border-format-hybrid bg-format-hybrid",
};

type FormatBadgeProps = {
    mode: EventFields["mode"];
    // Sets the size and font, which differ between the card and the event page.
    className?: string;
    muted?: boolean; // a gray outline instead of the format's colour, on past bookings
};

const FormatBadge = ({ mode, className = "px-2.5 py-1.5 font-mono text-xs", muted = false }: FormatBadgeProps) => (
    <span className={`whitespace-nowrap rounded-full border ${muted ? "border-border text-muted" : `font-bold text-on-accent ${FORMAT_COLORS[mode]}`} ${className}`}>
        {FORMAT_LABELS[mode]}
    </span>
);

export default FormatBadge;
