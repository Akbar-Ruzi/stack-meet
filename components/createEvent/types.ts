import type { EventFields } from "@/types/event.types";

export type EventFormValues = Omit<
    EventFields,
    'slug' | 'image' | 'tags' | 'agenda' | 'venue' | 'location'
> & {
    image: File | null;
    tags: string;
    agenda: string;
    venue: string;
    location: string;
};
