import type { AgendaItem } from "@/database/event.model";

const EventAgenda = ({agendaItems}: {agendaItems: AgendaItem[]}) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map(({start, title}, index) => (
                <li key={`${start}-${title}-${index}`}>{start} {title}</li>
            ))}
        </ul>
    </div>
)

export default EventAgenda;
