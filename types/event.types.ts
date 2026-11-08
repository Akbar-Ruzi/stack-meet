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
