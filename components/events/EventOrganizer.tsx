import { getInitials } from "@/lib/events/preview";

const EventOrganizer = ({ organizer }: { organizer: string }) => (
    <section className="flex flex-wrap items-center gap-4.5 rounded-2xl border border-line bg-surface p-6">
        <div aria-hidden="true" className="flex size-14 items-center justify-center rounded-full border border-border bg-background font-mono text-lg text-accent">
            {getInitials(organizer)}
        </div>
        <div className="min-w-0 flex-[1_1_240px]">
            <div className="font-mono text-xs text-muted">hosted by</div>
            <div className="mt-0.5 text-xl font-bold">{organizer}</div>
        </div>
    </section>
);

export default EventOrganizer;
