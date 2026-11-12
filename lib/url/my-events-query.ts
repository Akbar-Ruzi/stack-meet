import { firstParam } from "@/lib/events/search";

export type MyEventsTab = "hosting" | "booked";

export type MyEventsSearchParams = Record<string, string | string[] | undefined>;

// ?tab=booked opens the Booked tab. Anything else opens Hosting.
export const parseMyEventsTab = (params: MyEventsSearchParams): MyEventsTab =>
    firstParam(params.tab) === "booked" ? "booked" : "hosting";
