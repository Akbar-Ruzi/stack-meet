import { Suspense } from "react";
import type { EventSearch } from "@/lib/event-search";

const POPULAR_TAGS = ["react", "ai", "typescript", "python", "open-source"];

const LABEL_CLASSES = "flex flex-col gap-2 font-mono text-xs text-muted";
const FIELD_CLASSES =
    "h-[52px] rounded-[10px] border border-border bg-field px-4 font-sans text-base text-text placeholder:text-muted";

// The search reloads the home page with ?q=…&where=…, and "Next up" shows the matching events.
const SearchForm = ({ q, where }: EventSearch) => (
    <form role="search" action="/#events" method="get" className="mt-10 flex max-w-[860px] flex-wrap items-end gap-3">
        <label className={`flex-[2_1_300px] ${LABEL_CLASSES}`}>
            what
            <input type="search" name="q" defaultValue={q} placeholder="React, AI, hackathon…" className={FIELD_CLASSES} />
        </label>
        <label className={`flex-[1_1_200px] ${LABEL_CLASSES}`}>
            where
            <input type="text" name="where" defaultValue={where} placeholder="City or “online”" className={FIELD_CLASSES} />
        </label>
        <button
            type="submit"
            className="h-[52px] cursor-pointer rounded-[10px] bg-accent px-6 text-base font-bold text-on-accent max-[641px]:flex-[1_1_100%]"
        >
            Search events
        </button>
    </form>
);

// Fills the inputs with the current search once the URL is known.
const SearchFormWithValues = async ({ search }: { search: Promise<EventSearch> }) => (
    <SearchForm {...await search} />
);

const Hero = ({ search }: { search: Promise<EventSearch> }) => (
    <section className="mx-auto max-w-[1200px] px-6 pb-[72px] pt-24">
        <p className="font-mono text-sm text-accent">{"// hackathons · meetups · conferences"}</p>

        <h1 className="mt-5 bg-none text-[clamp(48px,7vw,92px)] font-bold leading-[0.98] tracking-[-0.035em] text-text max-[641px]:whitespace-nowrap max-[641px]:text-[38px] max-[641px]:leading-[1.05] max-[351px]:text-[32px]">
            Find your next
            <br />
            dev event.
        </h1>

        <p className="mt-6 max-w-[560px] text-xl leading-normal text-muted max-[641px]:text-[17px]">
            Search what&apos;s happening near you or online, save a spot with one email, and host your own in
            minutes.
        </p>

        <Suspense fallback={<SearchForm />}>
            <SearchFormWithValues search={search} />
        </Suspense>

        <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[13px]">
            <span className="mr-1 text-muted">popular:</span>
            {POPULAR_TAGS.map((tag) => (
                <a key={tag} href={`/?q=${tag}#events`} className="rounded-full border border-border px-3 py-2 text-text">
                    #{tag}
                </a>
            ))}
        </div>
    </section>
);

export default Hero;
