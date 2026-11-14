import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { useNavbarLock } from "@/context/navbar-lock-context";
import { useEventFormSteps } from "@/hooks/useEventFormSteps";
import {
    EVENT_FORM_DEFAULTS,
    TOTAL_STEPS,
    toEventFormData,
} from "@/lib/events/form";
import { STEP_SCHEMAS } from "@/lib/events/form-zod-schema";

// Publish takes Continue's place, so the second click of a double-click would land on it.
const PUBLISH_GUARD_MS = 500;

// Steps unlock one at a time through Continue, and the last one publishes.
export function useCreateEventForm() {
    const { setIsNavbarDisabled } = useNavbarLock();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const reachedLastStepAt = useRef(0);

    const { form, step, goNext, goToStep, goBack, resetSteps, handleChange } = useEventFormSteps({
        defaultValues: EVENT_FORM_DEFAULTS,
        schemas: STEP_SCHEMAS,
        allStepsUnlocked: false,
        isSubmitting,
    });

    const continueToNext = async () => {
        const movingToLastStep = step + 1 === TOTAL_STEPS;
        if ((await goNext()) && movingToLastStep) reachedLastStepAt.current = Date.now();
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
            resetSteps(EVENT_FORM_DEFAULTS);
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
            continueToNext();
            return;
        }
        if (Date.now() - reachedLastStepAt.current < PUBLISH_GUARD_MS) {
            e.preventDefault();
            return;
        }
        form.handleSubmit(publish)(e);
    };

    return { form, step, isSubmitting, goBack, goToStep, handleSubmit, handleChange, handleKeyDown };
}
