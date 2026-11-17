import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// The title width on each agenda row, so the rows don't all look the same.
const AGENDA_TITLE_WIDTHS = ["w-[62%]", "w-[48%]", "w-[56%]", "w-[40%]"];

// Shown in place of the event while it loads, in the same layout as EventHeader, EventContent
// and the booking card: breadcrumb, title, subtitle, pills, cover, About, agenda and the form.
const EventMainContentSkeleton = () => (
    <SkeletonGroup label="Loading event…">
        <div aria-hidden="true">
            <section className="mx-auto max-w-300 px-6 pb-8 pt-12">
                <Skeleton className="h-3.25 w-55" />
                <Skeleton shape="field" className="mt-6.5 h-14 w-[min(720px,92%)]" />
                <Skeleton shape="field" className="mt-3 h-14 w-[min(460px,70%)]" />
                <Skeleton className="mt-5.5 h-4.5 w-[min(620px,88%)]" />
                <div className="mt-7 flex flex-wrap gap-2.5">
                    <Skeleton shape="pill" className="h-8.5 w-35" />
                    <Skeleton shape="pill" className="h-8.5 w-35" />
                    <Skeleton shape="pill" className="h-8.5 w-19" />
                    <Skeleton shape="pill" className="h-8.5 w-14" />
                </div>
            </section>

            <div className="mx-auto max-w-300 px-6">
                <div className="flex flex-wrap items-start gap-10">
                    <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-12">
                        <Skeleton shape="cover" className="aspect-video w-full" />

                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-6.5 w-55" />
                            <Skeleton className="mt-1.5 h-4 w-full" />
                            <Skeleton className="h-4 w-[94%]" />
                            <Skeleton className="h-4 w-[70%]" />
                        </div>

                        <div className="flex flex-col gap-6.5">
                            <Skeleton className="h-6.5 w-30" />
                            {AGENDA_TITLE_WIDTHS.map((titleWidth) => (
                                <div key={titleWidth} className="flex items-center gap-5">
                                    <div className="flex w-16 flex-none flex-col items-end gap-1.5">
                                        <Skeleton className="h-5 w-14" />
                                        <Skeleton className="h-3 w-10" />
                                    </div>
                                    <Skeleton className="h-11 w-1 flex-none" />
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className={`h-4.5 ${titleWidth}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex min-w-0 max-w-100 flex-[1_1_320px] flex-col gap-3.5 rounded-[18px] border border-border bg-surface p-7">
                        <Skeleton className="h-3.25 w-30" />
                        <Skeleton className="h-6.5 w-50" />
                        <Skeleton className="mt-2 h-4 w-[86%]" />
                        <Skeleton className="h-4 w-[60%]" />
                        <Skeleton className="h-4 w-[76%]" />
                        <Skeleton shape="field" className="mt-2.5 h-12.5 w-full" />
                        <Skeleton shape="field" className="h-12.5 w-full" />
                        <Skeleton shape="field" className="h-12.5 w-full" />
                        <Skeleton shape="field" className="mt-1 h-13 w-full" />
                    </div>
                </div>
            </div>
        </div>
    </SkeletonGroup>
);

export default EventMainContentSkeleton;
