import Link from "next/link";
import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import HostBox from "@/components/home/HostBox";
import NextUp from "@/components/home/NextUp";
import { parseHomeQuery, type HomeSearchParams } from "@/lib/url/home-query";

export default function Page({ searchParams }: { searchParams: Promise<HomeSearchParams> }) {
    const query = searchParams.then(parseHomeQuery);

    return (
        <div data-full-width>
            <Hero search={query} />

            <section id="events" className="mx-auto max-w-300 scroll-mt-28 px-6 pb-18 pt-6">
                <Suspense fallback={<p className="text-muted">Loading events...</p>}>
                    <NextUp query={query} />
                </Suspense>

                <div className="mt-7">
                    <Link href="/calendar" className="inline-block py-3 font-mono text-sm text-accent">
                        see all in calendar →
                    </Link>
                </div>
            </section>

            <HostBox />
        </div>
    );
}
