import type { EventRecord } from "@/lib/data/events";
import SimilarEventCard from "@/components/events/SimilarEventCard";

const SimilarEvents = ({ events }: { events: EventRecord[] }) => {
    if (events.length === 0) return null;

    return (
        <section className="pt-18">
            <h2 className="mb-5 text-[30px] tracking-[-0.02em]">Similar events</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {events.map((event) => (
                    <SimilarEventCard key={event._id} {...event} />
                ))}
            </div>
        </section>
    );
};

export default SimilarEvents;
