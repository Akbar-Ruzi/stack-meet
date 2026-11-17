import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// Two months, with the title width of each row, so the rows don't all look the same.
const MONTHS = [
    { key: "first", titles: ["w-[62%]", "w-[48%]", "w-[56%]"] },
    { key: "second", titles: ["w-[52%]", "w-[66%]"] },
];

// One timeline row in TimelineEvent's layout: the date, the dot and line, then the card with
// the title, time and place, format badge and tags, and the Book button (full width on phones).
// Each bar sits in a box of the real line's height.
const TimelineRowSkeleton = ({ titleWidth }: { titleWidth: string }) => (
    <li className="flex items-stretch gap-5 max-[641px]:gap-2.5">
        <div className="flex w-15 flex-none flex-col items-end pt-4.5 max-[641px]:w-8.5 max-[641px]:pt-4">
            <div className="flex h-4 items-center max-[641px]:h-3.25">
                <Skeleton className="h-2.5 w-7 max-[641px]:w-6" />
            </div>
            <div className="flex h-7 items-center max-[641px]:h-5.5">
                <Skeleton className="h-5 w-8 max-[641px]:h-4 max-[641px]:w-6" />
            </div>
        </div>

        <div className="flex w-3 flex-none flex-col items-center">
            <Skeleton shape="pill" className="mt-6 size-3" />
            <span className="mt-1.5 w-px flex-1 bg-border" />
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-4 rounded-[14px] border border-line bg-surface px-5.5 py-5 max-[641px]:p-4">
            <div className="min-w-0 flex-[1_1_260px]">
                <div className="flex h-7 items-center">
                    <Skeleton className={`h-5 ${titleWidth}`} />
                </div>
                {/* On phones most titles wrap, so the skeleton shows a second title line there. */}
                <div className="hidden h-7 items-center max-[641px]:flex">
                    <Skeleton className="h-5 w-[40%]" />
                </div>
                <div className="mt-1.5 flex h-4.5 items-center">
                    <Skeleton className="h-3.5 w-[45%]" />
                </div>
                <div className="mt-2.5 flex h-6.5 items-center gap-2">
                    <Skeleton shape="pill" className="h-6.5 w-16" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-14" />
                </div>
                {/* On phones the tags wrap onto a second line. */}
                <div className="mt-2 hidden h-4 items-center gap-2 max-[641px]:flex">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>
            <Skeleton className="h-10 w-17.5 max-[641px]:h-11 max-[641px]:flex-[1_1_100%]" />
        </div>
    </li>
);

// Shown in place of the timeline while the events load: two month headings with their rows.
const CalendarTimelineSkeleton = () => (
    <SkeletonGroup label="Loading events…" className="flex flex-col gap-12">
        {MONTHS.map(({ key, titles }) => (
            <div key={key}>
                <div className="mb-5 flex h-9 items-center gap-3">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-3.5 w-10" />
                </div>
                <ol aria-hidden="true" className="flex flex-col gap-3.5">
                    {titles.map((titleWidth) => <TimelineRowSkeleton key={titleWidth} titleWidth={titleWidth} />)}
                </ol>
            </div>
        ))}
    </SkeletonGroup>
);

export default CalendarTimelineSkeleton;
