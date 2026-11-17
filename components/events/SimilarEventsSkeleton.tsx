import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// The title width on each card, so they don't all look the same.
const TITLE_WIDTHS = ["w-[72%]", "w-[60%]", "w-[80%]"];

// Shown in place of "Similar events" while they load: the real heading, then 3 cards in the
// same grid and border as SimilarEventCard. Each bar sits in a box of the real line's height,
// so the cards are as tall as the loaded ones.
const SimilarEventsSkeleton = () => (
    <SkeletonGroup label="Loading similar events…">
        <section aria-hidden="true" className="pt-18">
            <h2 className="mb-5 text-[30px] tracking-[-0.02em]">Similar events</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {TITLE_WIDTHS.map((titleWidth) => (
                    <div key={titleWidth} className="rounded-[14px] border border-line bg-surface p-5.5">
                        <div className="flex h-4 items-center">
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="mt-2 flex h-7 items-center">
                            <Skeleton className={`h-5 ${titleWidth}`} />
                        </div>
                        <div className="mt-1.5 flex h-4.5 items-center">
                            <Skeleton className="h-3.5 w-[55%]" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </SkeletonGroup>
);

export default SimilarEventsSkeleton;
