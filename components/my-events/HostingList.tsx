import HostedEventRow from "@/components/my-events/HostedEventRow";
import EmptyListState from "@/components/my-events/EmptyListState";
import type { HostedEvent } from "@/lib/data/my-events";

const HostingList = ({ events }: { events: HostedEvent[] }) => (
    <section aria-label="Events I'm hosting" className="flex flex-col gap-3.5">
        {events.length === 0 && <EmptyListState message="You're not hosting any events yet." href="/events/create" linkLabel="Create an event" />}
        {events.map((event) => (
            <HostedEventRow key={event._id} event={event} />
        ))}
    </section>
);

export default HostingList;
