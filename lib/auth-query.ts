import { firstParam } from "@/lib/event-search";
import type { AuthMode } from "@/hooks/useAuthForm";

export type AuthSearchParams = Record<string, string | string[] | undefined>;

// ?tab=create opens the Create account tab. Anything else opens Sign in.
export const parseAuthMode = (params: AuthSearchParams): AuthMode =>
    firstParam(params.tab) === "create" ? "sign-up" : "sign-in";

const SITE_BASE = "http://stackmeet.local";

// Where to go after signing in. Only pages on this site are allowed, so a crafted
// link can't send someone to another website. The URL parser catches disguised
// addresses such as "//evil.com" or "/\evil.com".
export const parseNextPath = (params: AuthSearchParams): string => {
    try {
        const url = new URL(firstParam(params.next) ?? "/", SITE_BASE);
        return url.origin === SITE_BASE ? `${url.pathname}${url.search}${url.hash}` : "/";
    } catch {
        return "/";
    }
};

// ?reason=create means the visitor was sent here from Create event.
export const isFromCreateEvent = (params: AuthSearchParams) => firstParam(params.reason) === "create";
