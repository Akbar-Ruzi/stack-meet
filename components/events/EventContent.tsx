import Image from "next/image";
import EventAgenda from "@/components/events/EventAgenda";
import EventOrganizer from "@/components/events/EventOrganizer";
import type { EventFields } from "@/types/event.types";

type EventContentProps = {
    event: EventFields;
};

const EventContent = ({ event }: EventContentProps) => {
    const { image, overview, date, agenda, organizer } = event;

    return (
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-12 wrap-anywhere">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-field">
                <Image
                    src={image}
                    alt="Event cover image"
                    fill
                    preload
                    sizes="(max-width: 1023px) 100vw, 800px"
                    className="object-cover"
                />
            </div>

            <section>
                <h2 className="mb-3.5 text-[26px] tracking-[-0.01em]">About this event</h2>
                <p className="text-[17px] leading-[1.65] text-body">{overview}</p>
            </section>

            {agenda && agenda.length > 0 && <EventAgenda agendaItems={agenda} date={date} />}

            <EventOrganizer organizer={organizer} />
        </div>
    );
};

export default EventContent;
