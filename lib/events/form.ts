import type { EventFormValues } from "@/types/event.types";

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
        JSON.stringify(
            values.agenda
                .map(({ time, item }) => ({ time: time.trim(), item: item.trim() }))
                .filter(({ time, item }) => time && item),
        ),
    );

    if (values.mode !== "online") {
        data.append("venue", values.venue.trim());
        data.append("location", values.location.trim());
    }

    const image = values.image?.[0];
    if (image) data.append("image", image);

    return data;
}
