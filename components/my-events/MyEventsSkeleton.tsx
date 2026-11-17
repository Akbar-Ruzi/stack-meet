import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";
import { ACTIONS_ROW } from "@/lib/constants";

// The title width on each row, so they don't all look the same.
const TITLE_WIDTHS = ["w-[58%]", "w-[44%]", "w-[52%]"];

// Shown in place of the tabs and the list while they load. Same tab bar and row layout as
// MyEventsTabs and HostedEventRow (date tile, title and format badge, place, count, and
// the View / Edit / Delete buttons), so nothing jumps when the events arrive. Each bar sits
// in a box of the real line's height. On phones the badge moves next to the date tile.
const MyEventsSkeleton = () => (
    <SkeletonGroup label="Loading your events…" className="flex flex-col gap-7">
        <div aria-hidden="true" className="flex gap-1 self-start rounded-xl border border-border bg-field p-1">
            <Skeleton className="h-11 w-27" />
            <Skeleton className="h-11 w-26.5" />
        </div>

        <div aria-hidden="true" className="flex flex-col gap-3.5">
            {TITLE_WIDTHS.map((titleWidth) => (
                <div key={titleWidth} className="flex flex-wrap items-center gap-x-5 gap-y-4.5 rounded-2xl border border-line bg-surface px-5 py-4.5">
                    <div className="flex flex-none max-[640px]:flex-[1_1_100%] max-[640px]:items-start max-[640px]:justify-between">
                        <Skeleton shape="tile" className="h-19 w-16" />
                        <span className="hidden max-[640px]:block">
                            <Skeleton shape="pill" className="h-7.5 w-16" />
                        </span>
                    </div>
                    <div className="min-w-0 flex-[1_1_260px]">
                        <div className="flex h-7 items-center gap-2">
                            <Skeleton className={`h-5 ${titleWidth}`} />
                            <span className="max-[640px]:hidden">
                                <Skeleton shape="pill" className="h-6 w-16" />
                            </span>
                        </div>
                        <div className="mt-1.5 flex h-4.5 items-center">
                            <Skeleton className="h-3.5 w-[40%]" />
                        </div>
                        <div className="mt-2 flex h-4.25 items-center gap-3.5">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <div className={ACTIONS_ROW}>
                        <Skeleton shape="field" className="h-11 w-15.5" />
                        <Skeleton shape="field" className="h-11 w-19" />
                        <Skeleton shape="field" className="h-11 w-18" />
                    </div>
                </div>
            ))}
        </div>
    </SkeletonGroup>
);

export default MyEventsSkeleton;
