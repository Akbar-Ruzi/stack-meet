import { Suspense } from "react";
import CalendarTimeline from "@/components/calendar/CalendarTimeline";

export default function CalendarPage() {
    return (
        <div data-full-width>
            <section className="mx-auto flex max-w-300 flex-wrap items-end justify-between gap-8 px-6 pb-10 pt-16">
                <div className="flex-[1_1_480px]">
                    <p className="font-mono text-[14px] text-accent">{"// calendar"}</p>
                    <h1 className="mt-4 bg-none text-[clamp(40px,5.5vw,72px)] font-bold leading-none tracking-[-0.035em] text-text">
                        Every event,<br />by date.
                    </h1>
                    <p className="mt-4.5 max-w-130 text-lg leading-[1.55] text-muted">
                        Scroll the months ahead, or narrow it down by format, topic and city.
                    </p>
                </div>
            </section>

            <section className="mx-auto flex max-w-300 flex-wrap items-start gap-10 px-6 pb-24">
                <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-12">
                    <Suspense fallback={<p className="text-muted">Loading events...</p>}>
                        <CalendarTimeline />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
