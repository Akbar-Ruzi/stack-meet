import Link from "next/link";
import { FORMAT_LABELS } from "@/lib/events/display";
import type { EventMode, EventSearch } from "@/lib/events/search";

const OPTIONS: { value?: EventMode; label: string }[] = [
    { label: "All" },
    { value: "online", label: FORMAT_LABELS.online },
    { value: "in-person", label: FORMAT_LABELS["in-person"] },
    { value: "hybrid", label: FORMAT_LABELS.hybrid },
];

type ModeFilterProps = EventSearch & { mode?: EventMode };

// Each pill is a link that keeps the current search and sets ?mode=, so the choice
// survives a refresh and can be shared.
const ModeFilter = ({ q, where, mode }: ModeFilterProps) => (
    <nav aria-label="Filter by format" className="flex flex-wrap gap-2">
        {OPTIONS.map(({ value, label }) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (where) params.set("where", where);
            if (value) params.set("mode", value);
            const query = params.toString();
            const selected = value === mode;

            return (
                <Link
                    key={label}
                    href={`/${query ? `?${query}` : ""}#events`}
                    scroll={false}
                    aria-current={selected ? "true" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-sm font-medium ${
                        selected ? "border-accent bg-accent text-on-accent" : "border-border text-text"
                    }`}
                >
                    {label}
                </Link>
            );
        })}
    </nav>
);

export default ModeFilter;
