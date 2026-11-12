export type EventAction = "edit" | "delete";

type PermissionInput = {
    event: { date: string; createdBy?: { toString(): string } | null };
    user: { id?: string; role?: string };
    action: EventAction;
    today?: string; // YYYY-MM-DD, a parameter so tests can fix the date
};

// null when allowed, otherwise the reason to send back with a 403.
// Only the owner can edit, and only an upcoming event. The owner or an admin can delete.
export function getPermissionError({
    event,
    user,
    action,
    today = new Date().toISOString().slice(0, 10),
}: PermissionInput): string | null {
    // Older events can be missing createdBy, so they have no owner.
    const isOwner = Boolean(user.id) && event.createdBy?.toString() === user.id;

    if (action === "delete") {
        return isOwner || user.role === "admin" ? null : "Only the event's owner or an admin can delete it.";
    }

    if (!isOwner) return "Only the event's owner can edit it.";
    if (event.date < today) return "Past events can't be edited.";
    return null;
}
