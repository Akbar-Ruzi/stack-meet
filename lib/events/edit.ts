import type { EventFields } from "@/types/event.types";

// The only fields an edit may change. slug and createdBy are never editable: the slug keeps shared
// links working, and createdBy stops events being handed to another user to get around the limit.
// The cover image is changed by uploading a new file, not through this list.
export const EDITABLE_FIELDS = [
    "title",
    "description",
    "overview",
    "venue",
    "location",
    "onlineUrl",
    "date",
    "time",
    "mode",
    "audience",
    "agenda",
    "organizer",
    "tags",
] as const satisfies readonly (keyof EventFields)[];

type EditableField = (typeof EDITABLE_FIELDS)[number];
export type EventUpdates = Partial<Pick<EventFields, EditableField>>;

const isEditableField = (key: string): key is EditableField => (EDITABLE_FIELDS as readonly string[]).includes(key);

type ParsedUpdates = { updates: EventUpdates; error?: never } | { updates?: never; error: string };

// Checks a PATCH body: it must be an object with at least one field, and every field must be editable.
// allowEmpty is for a request that only replaces the cover image.
// Field values are checked by the Mongoose model when the event is saved.
export function parseEventUpdates(body: unknown, { allowEmpty = false } = {}): ParsedUpdates {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return { error: "The request body must be a JSON object." };
    }

    const keys = Object.keys(body);
    const notAllowed = keys.filter((key) => !isEditableField(key));
    if (notAllowed.length > 0) {
        return { error: `These fields can't be changed: ${notAllowed.join(", ")}.` };
    }
    if (keys.length === 0 && !allowEmpty) {
        return { error: "Send at least one field to change." };
    }

    return { updates: body as EventUpdates };
}
