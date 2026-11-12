import { Suspense } from "react";
import MyEventsContent from "@/components/my-events/MyEventsContent";
import type { MyEventsSearchParams } from "@/lib/url/my-events-query";

export default function MyEventsPage({ searchParams }: { searchParams: Promise<MyEventsSearchParams> }) {
    return (
        <div data-full-width>
            <section className="mx-auto flex max-w-300 flex-col gap-7 px-6 pb-24 pt-12">
                <div>
                    <p className="font-mono text-[14px] text-accent">$ stackmeet me</p>
                    <h1 className="mt-3 bg-none text-[clamp(36px,5vw,56px)] font-bold leading-[1.04] tracking-[-0.03em] text-text">
                        My events
                    </h1>
                    <p className="mt-2.5 text-[17px] text-muted">Events you&apos;re hosting and spots you&apos;ve reserved.</p>
                </div>
                <Suspense fallback={null}>
                    <MyEventsContent searchParams={searchParams} />
                </Suspense>
            </section>
        </div>
    );
}
