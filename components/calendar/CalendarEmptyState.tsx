import Link from "next/link";

type CalendarEmptyStateProps = {
    title: string;
    action: string; // "Clear search" or "Clear filters"
    href: string;
};

// Replaces the timeline when nothing matches.
const CalendarEmptyState = ({ title, action, href }: CalendarEmptyStateProps) => (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
        <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4M8.5 8.5l5 5M13.5 8.5l-5 5" />
        </svg>
        <p className="mt-4 text-[22px] font-bold">{title}</p>
        <p className="mt-2 text-[15px] text-muted">
            Try a different topic or city, or clear the search to see every event.
        </p>
        <Link
            href={href}
            scroll={false}
            className="mt-5.5 flex min-h-12 items-center rounded-[10px] bg-accent px-5.5 text-base font-bold text-on-accent"
        >
            {action}
        </Link>
    </div>
);

export default CalendarEmptyState;
