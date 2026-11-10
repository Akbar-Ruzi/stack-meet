import type { AgendaItem } from "@/database/event.model";

// Base event data type without MongoDB document properties and it is is the blueprint of the event data
export interface EventFields {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue?: string; // Required for in-person and hybrid events.
  location?: string; // Required for in-person and hybrid events.
  onlineUrl?: string; // For online and hybrid events. Hidden from queries by default.
  date: string;
  time: string;
  mode: 'online' | 'in-person' | 'hybrid';
  audience: string;
  agenda?: AgendaItem[];
  organizer: string;
  tags?: string[];
}

export type AgendaRow = { time: string; item: string };

// The values the create event form holds while it's being filled in
export type EventFormValues = {
  title: string;
  description: string;
  overview: string;
  image: FileList | null;
  date: string;
  time: string;
  mode: EventFields["mode"];
  venue: string;
  location: string;
  onlineUrl: string;
  organizer: string;
  audience: string;
  tags: string[];
  agenda: AgendaRow[];
};
