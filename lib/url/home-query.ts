import { firstParam, isEventMode, type EventMode, type EventSearch } from "@/lib/events/search";

export type HomeSearchParams = Record<string, string | string[] | undefined>;
export type HomeQuery = EventSearch & { mode?: EventMode };

// Turns the home page URL (?q, ?where, ?mode) into a search. An unknown mode counts as no mode.
export function parseHomeQuery(params: HomeSearchParams): HomeQuery {
    const mode = firstParam(params.mode);

    return {
        q: firstParam(params.q),
        where: firstParam(params.where),
        mode: isEventMode(mode) ? mode : undefined,
    };
}
