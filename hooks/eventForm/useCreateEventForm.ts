import { useState } from "react";
import toast from "react-hot-toast";

import { useNavbarLock } from "@/context/navbar-lock-context";
import { useEventFormSteps } from "@/hooks/eventForm/useEventFormSteps";
import { EVENT_FORM_DEFAULTS, toEventFormData } from "@/lib/events/form";
import { STEP_SCHEMAS } from "@/lib/events/form-zod-schema";

// Starts empty, and the last step publishes.
export function useCreateEventForm() {
    const { setIsNavbarDisabled } = useNavbarLock();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { form, step, goToStep, goBack, resetSteps, handleSubmit, handleChange, handleKeyDown } = useEventFormSteps({
        defaultValues: EVENT_FORM_DEFAULTS,
        schemas: STEP_SCHEMAS,
        isSubmitting,
        onLastStepSubmit: () => publish(),
    });

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

    return { form, step, isSubmitting, goBack, goToStep, handleSubmit, handleChange, handleKeyDown };
}
