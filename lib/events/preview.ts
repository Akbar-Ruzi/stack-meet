import { formatDayAndDate, getEventPlace } from "@/lib/events/display";
import { getFilledAgendaRows } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

const toSlug = (title: string) =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

const getInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

// The text for the event page preview, with bracketed placeholders for anything still empty.
export function buildEventPagePreview(values: EventFormValues) {
    const title = values.title.trim();
    const organizer = values.organizer.trim();
    const dayAndDate = formatDayAndDate(values.date);

    return {
        slug: toSlug(title) || "[event-title]",
        title: title || "[Event title]",
        description: values.description.trim() || "[Short description]",
        overview: values.overview.trim() || "[Overview — what attendees will do, who it’s for and what to bring]",
        fullDate: dayAndDate ? `${dayAndDate} ${values.date.slice(0, 4)}` : "[Date]",
        agendaDate: dayAndDate || "[Date]",
        time: values.time || "[Time]",
        mode: values.mode,
        tags: values.tags,
        agenda: getFilledAgendaRows(values.agenda),
        organizer: organizer || "[Organizer]",
        initials: getInitials(organizer) || "OR",
        place: getEventPlace({ mode: values.mode, location: values.location.trim() }) || "[City]",
    };
}
