import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// The label widths of the 3 format rows and the 8 topic pills, so they don't all look the same.
const FORMAT_WIDTHS = ["w-14", "w-19", "w-15"];
const TOPIC_WIDTHS = ["w-21", "w-17", "w-24", "w-27", "w-19", "w-22", "w-25", "w-18"];

// Shown in place of the filter sidebar while the topics load. Same box, spacing and sizes as
// CalendarFilters: format with 3 checkbox rows, 8 topic pills, the city input and clear filters.
// min-w-67.5: the real city input's default width keeps the sidebar at least 270px wide.
const CalendarFiltersSkeleton = () => (
    <SkeletonGroup
        label="Loading filters…"
        className="flex min-w-67.5 max-w-72.5 flex-[1_1_250px] flex-col gap-6.5 rounded-2xl border border-line bg-surface p-6"
    >
        <div className="flex flex-col gap-0.5">
            {/* mb-1.5 plus the 2px gap: the real legend takes mb-2 and no gap. */}
            <div className="mb-1.5 flex h-4 items-center">
                <Skeleton className="h-3 w-12" />
            </div>
            {FORMAT_WIDTHS.map((width) => (
                <div key={width} className="flex min-h-10 items-center gap-2.5">
                    <Skeleton className="size-4.5" />
                    <Skeleton className={`h-3.5 ${width}`} />
                </div>
            ))}
        </div>

        <div>
            <div className="mb-3 flex h-4 items-center">
                <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex flex-wrap gap-2">
                {TOPIC_WIDTHS.map((width) => (
                    <Skeleton key={width} shape="pill" className={`h-8.75 ${width}`} />
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex h-4 items-center">
                <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton shape="field" className="h-11.5 w-full" />
        </div>

        <Skeleton shape="field" className="h-11 w-full" />
    </SkeletonGroup>
);

export default CalendarFiltersSkeleton;
