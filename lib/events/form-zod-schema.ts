import { z } from "zod";
import { getCoverImageError } from "@/lib/events/cover-image-rules";

const required = (message: string) => z.string().trim().min(1, message);

const basicsSchema = z.object({
    title: required("Add a title to continue.").max(100, "Keep the title under 100 characters."),
    description: required("Add a short description to continue.").max(1000, "Keep the description under 1000 characters."),
    overview: required("Add an overview to continue.").max(500, "Keep the overview under 500 characters."),
    image: z
        .custom<FileList>((value) => value instanceof FileList && value.length > 0, "Add a cover image to continue.")
        .superRefine((files, ctx) => {
            // Zod can still run this after the check above fails, so a missing file is skipped here.
            const file = files?.[0];
            const error = file ? getCoverImageError(file) : null;
            if (error) ctx.addIssue({ code: "custom", message: error });
        }),
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
