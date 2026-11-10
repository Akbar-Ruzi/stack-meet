import { z } from "zod";
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

export const TOTAL_STEPS = 3;

const required = (message: string) => z.string().trim().min(1, message);

const basicsSchema = z.object({
    title: required("Add a title to continue.").max(100, "Keep the title under 100 characters."),
    description: required("Add a short description to continue.").max(1000, "Keep the description under 1000 characters."),
    overview: required("Add an overview to continue.").max(500, "Keep the overview under 500 characters."),
    image: z.custom<FileList>((value) => value instanceof FileList && value.length > 0, "Add a cover image to continue."),
});

const whenWhereSchema = z
    .object({
        date: required("Choose a date to continue."),
        time: required("Choose a start time to continue."),
        mode: z.enum(["online", "in-person", "hybrid"]),
        venue: z.string(),
        location: z.string(),
    })
    .superRefine(({ mode, venue, location }, ctx) => {
        if (mode === "online") return;
        if (!venue.trim()) ctx.addIssue({ code: "custom", path: ["venue"], message: "Add a venue to continue." });
        if (!location.trim()) ctx.addIssue({ code: "custom", path: ["location"], message: "Add a city to continue." });
    });

const agendaRowSchema = z
    .object({ time: z.string(), item: z.string() })
    .superRefine(({ time, item }, ctx) => {
        if (Boolean(time.trim()) === Boolean(item.trim())) return;
        const timeIsMissing = !time.trim();
        ctx.addIssue({
            code: "custom",
            path: [timeIsMissing ? "time" : "item"],
            message: timeIsMissing ? "Choose a time for this item." : "Add an item for this time.",
        });
    });

const audienceSchema = z.object({
    organizer: required("Add an organizer to continue."),
    audience: required("Add an audience to continue."),
    tags: z.array(z.string()),
    agenda: z.array(agendaRowSchema),
});

// One schema per step, so Continue checks only the step on screen.
export const STEP_SCHEMAS = [basicsSchema, whenWhereSchema, audienceSchema];

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
