import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// One label and control in Input's layout. The control height is the real one: 50px input,
// 146px textarea, or the 160px cover drop zone.
const FieldSkeleton = ({ labelWidth, control }: { labelWidth: string; control: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex h-4.75 items-center">
            <Skeleton className={`h-3.5 ${labelWidth}`} />
        </div>
        <Skeleton shape="field" className={`w-full ${control}`} />
    </div>
);

// Edit event's heading: prompt with the slug (two lines on phones), title and subtitle
// (three lines on phones). The title box follows the real clamp() size times its 1.02 line height.
const HeadingSkeleton = () => (
    <div className="mx-auto max-w-312 px-6 pt-14">
        <div className="flex h-4.5 flex-col justify-center gap-2 max-sm:h-9 max-sm:justify-around">
            <Skeleton className="h-3.5 w-80 max-w-full" />
            <Skeleton className="hidden h-3.5 w-40 max-sm:block" />
        </div>
        <div className="mt-3.5 flex h-[clamp(40.8px,5.61vw,65.28px)] items-center">
            <Skeleton shape="field" className="h-[75%] w-[min(320px,70%)]" />
        </div>
        <div className="mt-3.5 flex h-13.5 max-w-140 flex-col justify-around max-sm:h-20.25">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[60%] max-sm:w-full" />
            <Skeleton className="hidden h-4 w-[40%] max-sm:block" />
        </div>
    </div>
);

type EventFormSkeletonProps = {
    withHeading?: boolean; // Edit event: its heading loads with the form
};

// Shown in place of the Create and Edit event forms while they load, in EventWizard's step 1
// layout: the progress bar (hidden on phones), the Basics card with title, description,
// overview and cover, the footer with the Continue button, and the preview beside it.
// Each bar sits in a box of the real line's height, so nothing jumps when the form arrives.
const EventFormSkeleton = ({ withHeading = false }: EventFormSkeletonProps) => (
    <SkeletonGroup label="Loading form…">
        <div aria-hidden="true">
            {withHeading && <HeadingSkeleton />}

            <div className="mx-auto max-w-312 px-6 pb-8">
                <div className="mt-9 grid max-w-200 grid-cols-3 gap-3 max-sm:hidden">
                    {["w-14", "w-24", "w-20"].map((titleWidth) => (
                        <div key={titleWidth} className="flex flex-col gap-2.5">
                            <Skeleton className="h-1" />
                            <div className="flex min-h-11 items-center gap-2.5">
                                <Skeleton shape="pill" className="size-7 flex-none" />
                                <div className="flex flex-col">
                                    <div className="flex h-3.5 items-center">
                                        <Skeleton className="h-2.5 w-10" />
                                    </div>
                                    <div className="flex h-4.75 items-center">
                                        <Skeleton className={`h-3.5 ${titleWidth}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-312 flex-wrap items-start gap-10 px-6 pb-24">
                <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
                    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-7">
                        <div className="mb-1 flex items-center gap-4 border-b border-line pb-5">
                            <Skeleton shape="tile" className="size-12 flex-none" />
                            <div className="flex flex-1 flex-col gap-1">
                                <div className="flex h-7.75 items-center">
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <div className="flex h-4.75 flex-col justify-around max-sm:h-9.5">
                                    <Skeleton className="h-3.5 w-[min(320px,100%)]" />
                                    <Skeleton className="hidden h-3.5 w-[50%] max-sm:block" />
                                </div>
                            </div>
                        </div>
                        <FieldSkeleton labelWidth="w-12" control="h-12.5" />
                        <FieldSkeleton labelWidth="w-36" control="h-12.5" />
                        <FieldSkeleton labelWidth="w-20" control="h-36.5" />
                        <div className="flex flex-col gap-2">
                            <div className="flex h-4.75 items-center">
                                <Skeleton className="h-3.5 w-28" />
                            </div>
                            <Skeleton shape="tile" className="h-40 w-full" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex h-4.25 items-center">
                            <Skeleton className="h-3 w-21.5" />
                        </div>
                        <Skeleton shape="field" className="h-13 w-35" />
                    </div>
                </div>

                <div className="flex max-w-90 flex-[1_1_300px] flex-col gap-3.5">
                    <div>
                        <div className="flex h-7 items-center">
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="mt-1 flex h-4.5 items-center">
                            <Skeleton className="h-3.5 w-[85%]" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4.5 rounded-2xl border border-line bg-surface p-5">
                        <div className="flex items-start justify-between gap-3">
                            <Skeleton shape="tile" className="h-19 w-16" />
                            <Skeleton shape="pill" className="h-7.5 w-21.5" />
                        </div>
                        {/* The real card's title and place lines are empty until the form is filled in. */}
                        <div className="h-2" />
                    </div>
                    <Skeleton shape="field" className="h-12 w-full" />
                    {/* 3 lines beside the form, 2 once the preview drops below it (under 988px). */}
                    <div className="flex h-15.75 flex-col justify-around max-[988px]:h-10.5">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-[92%]" />
                        <Skeleton className="h-3.5 w-[45%] max-[988px]:hidden" />
                    </div>
                </div>
            </div>
        </div>
    </SkeletonGroup>
);

export default EventFormSkeleton;
