// Constants used in more than one file. A constant used by one file stays in that file.

// Usage limits for events, bookings and cover images.

// Events one user can create. Admins are exempt.
export const MAX_EVENTS_PER_USER = 3;

// Forms and API checks.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Styles shared by the event page and its preview on the create form.

export const PILL_CLASSES = "rounded-full border border-border px-3 py-2";

// Agenda rows cycle through these colors, in order.
export const AGENDA_BAR_COLORS = ["bg-accent", "bg-format-online", "bg-format-in-person", "bg-format-hybrid", "bg-[#A78BFA]"];
