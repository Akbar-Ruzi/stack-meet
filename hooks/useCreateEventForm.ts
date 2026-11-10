import { useRef, useState } from "react";
import { useForm, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useNavbarLock } from "@/lib/context/navbar-lock-context";
import {
    EVENT_FORM_DEFAULTS,
    STEP_SCHEMAS,
    TOTAL_STEPS,
    toEventFormData,
} from "@/lib/event-form";
import type { EventFormValues } from "@/types/event.types";

// Publish takes Continue's place, so the second click of a double-click would land on it.
const PUBLISH_GUARD_MS = 500;

// Holds the current step, checks only that step on Continue, and publishes on the last one.
export function useCreateEventForm() {
    const { setIsNavbarDisabled } = useNavbarLock();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const reachedLastStepAt = useRef(0);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(STEP_SCHEMAS[step - 1]) as unknown as Resolver<EventFormValues>,
        defaultValues: EVENT_FORM_DEFAULTS,
    });

    const goNext = async () => {
        const stepIsValid = await form.trigger(undefined, { shouldFocus: true });
        if (!stepIsValid) return;
        if (step + 1 === TOTAL_STEPS) reachedLastStepAt.current = Date.now();
        setStep((current) => current + 1);
    };

    const goBack = () => {
        form.clearErrors();
        setStep((current) => current - 1);
    };

    const publish = async () => {
        setIsSubmitting(true);
        setIsNavbarDisabled(true);
        const toastId = toast.loading("Creating event...");

        try {
            // getValues, because the resolver only returns the fields of the last step.
            const res = await fetch("/api/events", { method: "POST", body: toEventFormData(form.getValues()) });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to create event.", { id: toastId });
                return;
            }

            toast.success(data.message || "Event created successfully.", { id: toastId });
            form.reset(EVENT_FORM_DEFAULTS);
            setStep(1);
        } catch (error) {
            console.error("Create event failed:", error);
            toast.error("Something went wrong. Please try again.", { id: toastId });
        } finally {
            setIsSubmitting(false);
            setIsNavbarDisabled(false);
        }
    };

    // Enter continues on the earlier steps. On the last one it does nothing, so
    // an event can only be published with the Publish button.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && step === TOTAL_STEPS && e.target instanceof HTMLInputElement) e.preventDefault();
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        if (step < TOTAL_STEPS) {
            e.preventDefault();
            goNext();
            return;
        }
        if (Date.now() - reachedLastStepAt.current < PUBLISH_GUARD_MS) {
            e.preventDefault();
            return;
        }
        form.handleSubmit(publish)(e);
    };

    // A field's error goes away as soon as it's edited.
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const name = e.target.name as Path<EventFormValues> | "";
        if (name) form.clearErrors(name);
    };

    return { form, step, isSubmitting, goBack, handleSubmit, handleChange, handleKeyDown };
}
