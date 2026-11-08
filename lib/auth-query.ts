import { firstParam } from "@/lib/event-search";
import type { AuthMode } from "@/hooks/useAuthForm";

export type AuthSearchParams = Record<string, string | string[] | undefined>;

// ?tab=create opens the Create account tab. Anything else opens Sign in.
export const parseAuthMode = (params: AuthSearchParams): AuthMode =>
    firstParam(params.tab) === "create" ? "sign-up" : "sign-in";

// ?reason=create means the visitor was sent here from Create event.
export const isFromCreateEvent = (params: AuthSearchParams) => firstParam(params.reason) === "create";
