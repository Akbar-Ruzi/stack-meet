"use client";
import AuthField from "@/components/auth/AuthField";
import AuthNotice from "@/components/auth/AuthNotice";
import { useAuthForm, type AuthMode } from "@/hooks/useAuthForm";

const COPY = {
    "sign-in": {
        prompt: "$ stackmeet login",
        heading: "Welcome back",
        sub: "Sign in to see your bookings and manage your events.",
        cta: "Sign in",
        submitting: "Signing in...",
        switchText: "No account yet?",
        switchLink: "Create one",
    },
    "sign-up": {
        prompt: "$ stackmeet signup",
        heading: "Create your account",
        sub: "Book spots and host your own events.",
        cta: "Create account",
        submitting: "Creating...",
        switchText: "Already have an account?",
        switchLink: "Sign in",
    },
};

const TABS: { mode: AuthMode; label: string }[] = [
    { mode: "sign-in", label: "Sign in" },
    { mode: "sign-up", label: "Create account" },
];

type AuthPanelProps = {
    initialMode: AuthMode;
    fromCreateEvent: boolean;
};

const AuthPanel = ({ initialMode, fromCreateEvent }: AuthPanelProps) => {
    const { mode, setMode, isSubmitting, handleSubmit } = useAuthForm(initialMode);
    const isSignUp = mode === "sign-up";
    const copy = COPY[mode];

    return (
        <div className="w-full max-w-110">
            {fromCreateEvent && <AuthNotice />}
            <p className="font-mono text-[14px] text-accent">{copy.prompt}</p>
            <h1 className="mt-3 bg-none text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-text">{copy.heading}</h1>
            <p className="mt-3 text-[17px] leading-normal text-muted">{copy.sub}</p>

            <div role="tablist" aria-label="Account" className="mt-8 grid grid-cols-2 gap-1 rounded-xl border border-border bg-field p-1">
                {TABS.map((tab) => {
                    const selected = tab.mode === mode;
                    return (
                        <button
                            key={tab.mode}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setMode(tab.mode)}
                            className={`min-h-11 cursor-pointer rounded-lg text-[15px] font-bold ${selected ? "bg-accent text-on-accent" : "text-muted"}`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4.5">
                {isSignUp && <AuthField id="auth-name" name="name" label="name" type="text" autoComplete="name" placeholder="Your name" required />}
                <AuthField id="auth-email" name="email" label="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                <AuthField
                    id="auth-password"
                    name="password"
                    label="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    hint={isSignUp ? "At least 8 characters." : undefined}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1.5 h-13 cursor-pointer rounded-[10px] bg-accent text-base font-bold text-on-accent disabled:cursor-not-allowed"
                >
                    {isSubmitting ? copy.submitting : copy.cta}
                </button>
            </form>

            <p className="mt-6 text-center text-[15px] text-muted">
                {copy.switchText}
                <button
                    type="button"
                    onClick={() => setMode(isSignUp ? "sign-in" : "sign-up")}
                    className="cursor-pointer px-1 py-2.5 text-[15px] font-bold text-accent"
                >
                    {copy.switchLink}
                </button>
            </p>
        </div>
    );
};

export default AuthPanel;
