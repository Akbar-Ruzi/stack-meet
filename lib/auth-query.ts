import { firstParam } from "@/lib/event-search";
import type { AuthMode } from "@/hooks/useAuthForm";

export type AuthSearchParams = Record<string, string | string[] | undefined>;

// ?tab=create opens the Create account tab. Anything else opens Sign in.
export const parseAuthMode = (params: AuthSearchParams): AuthMode =>
    firstParam(params.tab) === "create" ? "sign-up" : "sign-in";
