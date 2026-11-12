import Image from "next/image";
import FormatBadge from "@/components/ui/FormatBadge";
import { buildEventPagePreview } from "@/lib/events/preview";
import { AGENDA_BAR_COLORS, PILL_CLASSES } from "@/lib/constants";
import type { EventFormValues } from "@/types/event.types";

const SECTION_HEADING_CLASSES = "text-[26px] tracking-[-0.01em]";

type EventPagePreviewProps = {
    titleId: string;
    values: EventFormValues;
    coverUrl: string | null;
};

const EventPagePreview = ({ titleId, values, coverUrl }: EventPagePreviewProps) => {
    const event = buildEventPagePreview(values);

    return (
        <div className="flex flex-col gap-10 px-10 pb-12 pt-8 wrap-anywhere max-sm:px-6 max-sm:pb-16">
            <div>
                <p className="font-mono text-[13px] text-muted">events / {event.slug}</p>
                <h2 id={titleId} className="mt-4 text-[clamp(34px,5vw,56px)] font-bold leading-[1.04] tracking-[-0.03em]">{event.title}</h2>
                <p className="mt-3.5 max-w-170 text-lg leading-normal text-muted">{event.description}</p>
                <div className="mt-5.5 flex flex-wrap gap-2.5 font-mono text-[13px]">
                    <span className={PILL_CLASSES}>{event.fullDate}</span>
                    <span className={PILL_CLASSES}>{event.time}</span>
                    <FormatBadge mode={event.mode} className="px-3 py-2" />
                    {event.tags.map((tag) => <span key={tag} className={PILL_CLASSES}>#{tag}</span>)}
                </div>
            </div>

            {coverUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
                    <Image src={coverUrl} alt="Event cover image" fill unoptimized className="object-cover" />
                </div>
            ) : (
                <div role="img" aria-label="Event cover image placeholder" className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-field font-mono text-[14px] text-muted">
                    [Event cover image]
                </div>
            )}

            <section>
                <h3 className={`mb-3.5 ${SECTION_HEADING_CLASSES}`}>About this event</h3>
                <p className="text-[17px] leading-[1.65] text-body">{event.overview}</p>
            </section>

            {event.agenda.length > 0 && (
                <section>
                    <h3 className={`mb-1.5 ${SECTION_HEADING_CLASSES}`}>Agenda</h3>
                    <p className="mb-5 font-mono text-[13px] text-muted">{event.agendaDate}</p>
                    <ol className="flex flex-col gap-6.5">
                        {event.agenda.map(({ start, title }, index) => (
                            <li key={`${start}-${title}-${index}`} className="flex items-center gap-5">
                                <time className="w-16 flex-none text-right text-[22px] font-bold leading-[1.1]">{start}</time>
                                <span aria-hidden="true" className={`h-9 w-1 flex-none rounded-lg ${AGENDA_BAR_COLORS[index % AGENDA_BAR_COLORS.length]}`} />
                                <div className="min-w-0 text-lg font-medium leading-[1.3]">{title}</div>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            <section className="flex flex-wrap items-center gap-4.5 rounded-2xl border border-line bg-surface p-6">
                <div aria-hidden="true" className="flex size-14 items-center justify-center rounded-full border border-border bg-[#1C211E] font-mono text-lg text-accent">
                    {event.initials}
                </div>
                <div className="min-w-0 flex-[1_1_220px]">
                    <div className="font-mono text-xs text-muted">hosted by</div>
                    <div className="mt-0.5 text-xl font-bold">{event.organizer}</div>
                    <div className="mt-1 text-[15px] text-muted">{event.place}</div>
                </div>
            </section>

            <p className="border-t border-line pt-6 text-[15px] text-muted">
                Looks right? Close the preview and click <strong className="text-text">Publish event</strong>.
            </p>
        </div>
    );
};

export default EventPagePreview;
