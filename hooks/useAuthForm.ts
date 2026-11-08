import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type AuthMode = "sign-in" | "sign-up";

const readField = (form: HTMLFormElement, name: string) =>
    (form.elements.namedItem(name) as HTMLInputElement).value;

// Holds the selected tab and submits the form for that tab.
export function useAuthForm() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("sign-in");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitSignIn = async (form: HTMLFormElement) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Signing in...");

        const result = await signIn("credentials", {
            email: readField(form, "email").trim(),
            password: readField(form, "password"),
            redirect: false,
        });

        setIsSubmitting(false);

        if (result?.error) {
            toast.error("Invalid email or password.", { id: toastId });
            return;
        }

        toast.success("Welcome back!", { id: toastId });
        router.push("/");
        router.refresh();
    };

    const submitSignUp = async (form: HTMLFormElement) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Creating account...");

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
        setIsSubmitting(false);

        if (!res.ok) {
            toast.error(data.message || "Signup failed.", { id: toastId });
            return;
        }

        toast.success("Account created! Please sign in.", { id: toastId });
        setMode("sign-in");
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (mode === "sign-up") submitSignUp(e.currentTarget);
        else submitSignIn(e.currentTarget);
    };

    return { mode, setMode, isSubmitting, handleSubmit };
}
