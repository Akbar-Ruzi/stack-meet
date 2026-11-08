import Link from "next/link";

const HostBox = () => (
    <section className="mx-auto max-w-300 px-6 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-dashed border-border bg-surface p-12 max-[641px]:gap-5 max-[641px]:px-5 max-[641px]:py-6">
            <div className="flex-[1_1_420px]">
                <p className="font-mono text-[13px] text-accent">$ stackmeet create</p>
                <h2 className="mt-2.5 text-4xl font-bold tracking-[-0.02em] max-[641px]:text-[28px]">
                    Hosting a meetup or hackathon?
                </h2>
                <p className="mt-3 text-[17px] leading-normal text-muted">
                    Publish it in a few minutes and collect RSVPs by email — online, in person or hybrid.
                </p>
            </div>
            <Link
                href="/events/create"
                className="rounded-[10px] bg-accent px-6 py-4 text-center text-base font-bold text-on-accent max-[641px]:flex-[1_1_100%]"
            >
                Create an event
            </Link>
        </div>
    </section>
);

export default HostBox;
