import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { toast, toastAfterPageLoad } from "@/lib/toast";

export type AuthMode = "sign-in" | "sign-up";

const REQUEST_FAILED_MESSAGE = "Something went wrong. Please try again.";

const readField = (form: HTMLFormElement, name: string) =>
    (form.elements.namedItem(name) as HTMLInputElement).value;

const welcomeBack = (name?: string | null) => {
    const firstName = name?.trim().split(/\s+/)[0];
    return firstName ? `Welcome back, ${firstName}.` : "Welcome back.";
};

// Holds the selected tab and submits the form for that tab. A failed request returns
// formError, shown above the submit button; switching tabs clears it.
export function useAuthForm(initialMode: AuthMode = "sign-in", nextPath = "/") {
    const [mode, setModeState] = useState<AuthMode>(initialMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const setMode = (next: AuthMode) => {
        setModeState(next);
        setFormError(null);
    };

    const submitSignIn = async (form: HTMLFormElement) => {
        setIsSubmitting(true);

        try {
            const result = await signIn("credentials", {
                email: readField(form, "email").trim(),
                password: readField(form, "password"),
                redirect: false,
            });

            // Auth.js returns nothing if it couldn't reach its own endpoints.
            if (!result) throw new Error("Sign in returned no result.");

            if (result.error) {
                setFormError("Invalid email or password.");
                setIsSubmitting(false);
                return;
            }

            const session = await getSession();
            toastAfterPageLoad(welcomeBack(session?.user?.name));
            // A full page load, not router.push: the router may still hold the signed-out
            // redirect for nextPath (e.g. /events/create → sign-in), and reusing it loops forever.
            // The button stays disabled while the next page loads.
            window.location.assign(nextPath);
        } catch (error) {
            console.error("Sign in failed:", error);
            setFormError(REQUEST_FAILED_MESSAGE);
            setIsSubmitting(false);
        }
    };

    const submitSignUp = async (form: HTMLFormElement) => {
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: readField(form, "name").trim(),
                    email: readField(form, "email").trim(),
                    password: readField(form, "password"),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setFormError(data.message || "Signup failed.");
                return;
            }

            setMode("sign-in");
            toast("Account created. Please sign in.");
        } catch (error) {
            console.error("Sign up failed:", error);
            setFormError(REQUEST_FAILED_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setFormError(null);
        if (mode === "sign-up") submitSignUp(e.currentTarget);
        else submitSignIn(e.currentTarget);
    };

    return { mode, setMode, isSubmitting, formError, handleSubmit };
}
