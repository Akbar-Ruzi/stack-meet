import { useEventFormSteps } from "@/hooks/eventForm/useEventFormSteps";
import { TOTAL_STEPS } from "@/lib/events/form";
import { EDIT_STEP_SCHEMAS } from "@/lib/events/form-zod-schema";
import type { EventFormValues } from "@/types/event.types";

// Starts from the saved event, and any step can be opened at any time.
export function useEditEventForm(defaultValues: EventFormValues) {
    const { form, step, goNext, goToStep, goBack, validateAllSteps, handleChange } = useEventFormSteps({
        defaultValues,
        schemas: EDIT_STEP_SCHEMAS,
        allStepsUnlocked: true,
        isSubmitting: false,
    });

    // Enter or Continue checks the step on screen, then moves on. Nothing is saved yet.
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step < TOTAL_STEPS) goNext();
    };

    return { form, step, goBack, goToStep, validateAllSteps, handleSubmit, handleChange };
}
