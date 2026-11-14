import type { EventFields, EventFormValues } from "@/types/event.types";

export const EVENT_FORM_DEFAULTS: EventFormValues = {
    title: "",
    description: "",
    overview: "",
    image: null,
    date: "",
    time: "",
    mode: "in-person",
    venue: "",
    location: "",
    onlineUrl: "",
    organizer: "",
    audience: "",
    tags: [],
    agenda: [{ time: "", item: "" }],
};

export const FORM_STEPS = [
    { title: "Basics", description: "What your event is and how it looks." },
    { title: "When & where", description: "Date, time and how people attend." },
    { title: "Audience & agenda", description: "Who it's for and what happens when." },
];

export const TOTAL_STEPS = FORM_STEPS.length;

// A saved event as form values, for the edit form. The cover stays empty: no new file means keep the current one.
export function toEventFormValues(event: EventFields): EventFormValues {
    const agenda = (event.agenda ?? []).map(({ start, title }) => ({ time: start, item: title }));

    return {
        title: event.title,
        description: event.description,
        overview: event.overview,
        image: null,
        date: event.date,
        time: event.time,
        mode: event.mode,
        venue: event.venue ?? "",
        location: event.location ?? "",
        onlineUrl: event.onlineUrl ?? "",
        organizer: event.organizer,
        audience: event.audience,
        tags: event.tags ?? [],
        agenda: agenda.length > 0 ? agenda : EVENT_FORM_DEFAULTS.agenda,
    };
}

// Blank rows are allowed in the form, but they aren't part of the event.
export function getFilledAgendaRows(rows: EventFormValues["agenda"]) {
    return rows
        .map(({ time, item }) => ({ start: time.trim(), title: item.trim() }))
        .filter(({ start, title }) => start && title);
}

// Builds the body POST /api/events expects.
export function toEventFormData(values: EventFormValues): FormData {
    const data = new FormData();

    data.append("title", values.title.trim());
    data.append("description", values.description.trim());
    data.append("overview", values.overview.trim());
    data.append("date", values.date);
    data.append("time", values.time);
    data.append("mode", values.mode);
    data.append("organizer", values.organizer.trim());
    data.append("audience", values.audience.trim());
    data.append("tags", JSON.stringify(values.tags));
    data.append(
        "agenda",
        JSON.stringify(getFilledAgendaRows(values.agenda)),
    );

    if (values.mode !== "online") {
        data.append("venue", values.venue.trim());
        data.append("location", values.location.trim());
    }

    const onlineUrl = values.onlineUrl.trim();
    if (values.mode !== "in-person" && onlineUrl) data.append("onlineUrl", onlineUrl);

    const image = values.image?.[0];
    if (image) data.append("image", image);

    return data;
}

// True when saving would change the event. It compares what would be sent, so spaces around
// text, blank agenda rows and fields the format doesn't use don't count as changes.
export function hasEventFormChanges(values: EventFormValues, saved: EventFormValues): boolean {
    if (values.image?.[0]) return true;
    const toSent = (formValues: EventFormValues) => JSON.stringify([...toEventFormData(formValues).entries()]);
    return toSent(values) !== toSent(saved);
}
