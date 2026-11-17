import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// The title bar's width on each of the 6 cards, so they don't all look the same.
const TITLE_WIDTHS = ["w-[78%]", "w-[64%]", "w-[84%]", "w-[70%]", "w-[60%]", "w-[80%]"];

// Shown in place of the "Next up" grid while the events load: 6 cards in the same grid and border
// as EventCard, with a date tile, format pill, title, place line, two tags and the footer.
const EventGridSkeleton = () => (
    <SkeletonGroup label="Loading events…">
        <ul aria-hidden="true" className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-5">
            {TITLE_WIDTHS.map((titleWidth) => (
                <li key={titleWidth} className="flex flex-col gap-4.5 rounded-2xl border border-line bg-surface p-5">
                    <div className="flex items-start justify-between gap-3">
                        <Skeleton shape="tile" className="h-18.5 w-16" />
                        <Skeleton shape="pill" className="h-6.5 w-19" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Skeleton className={`h-5 ${titleWidth}`} />
                        <Skeleton className="h-3.5 w-[58%]" />
                        <div className="flex gap-2">
                            <Skeleton className="h-3 w-13" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <div className="border-t border-line pt-3.5">
                        <Skeleton className="h-3.25 w-23" />
                    </div>
                </li>
            ))}
        </ul>
    </SkeletonGroup>
);

export default EventGridSkeleton;
