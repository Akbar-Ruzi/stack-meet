import type { ReactNode } from "react";

type SkeletonGroupProps = {
    label: string; // read by screen readers, for example "Loading events…"
    className?: string;
    children: ReactNode; // the Skeleton blocks, laid out like the real content
};

// Wraps a loading skeleton: the blocks are hidden from screen readers, and one hidden status line
// says what's loading. Nothing shows for the first 300 ms, so fast loads don't flash.
const SkeletonGroup = ({ label, className = "", children }: SkeletonGroupProps) => (
    <div className={`animate-appear-late ${className}`}>
        <p role="status" className="sr-only">{label}</p>
        {children}
    </div>
);

export default SkeletonGroup;
