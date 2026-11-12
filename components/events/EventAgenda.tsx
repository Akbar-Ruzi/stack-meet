import type { AgendaItem } from "@/database/event.model";
import { formatDayAndDate } from "@/lib/events/display";
import { AGENDA_BAR_COLORS } from "@/lib/constants";

type EventAgendaProps = {
    agendaItems: AgendaItem[];
    date: string;
};

const EventAgenda = ({ agendaItems, date }: EventAgendaProps) => (
    <section>
        <h2 className="mb-2.5 text-[26px] tracking-[-0.01em]">Agenda</h2>
        <p className="mb-5 font-mono text-[13px] text-muted">{formatDayAndDate(date)}</p>
        <ol className="flex flex-col gap-6.5">
            {agendaItems.map(({ start, title }, index) => (
                <li key={`${start}-${title}-${index}`} className="flex items-center gap-5">
                    <time className="w-16 flex-none text-right text-[22px] font-bold leading-[1.1] tracking-[-0.01em]">{start}</time>
                    <span aria-hidden="true" className={`h-11 w-1 flex-none rounded-lg ${AGENDA_BAR_COLORS[index % AGENDA_BAR_COLORS.length]}`} />
                    <div className="min-w-0 text-lg font-medium leading-[1.3]">{title}</div>
                </li>
            ))}
        </ol>
    </section>
);

export default EventAgenda;
