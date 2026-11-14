import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWatch } from "react-hook-form";

import { useNavbarLock } from "@/context/navbar-lock-context";
import { useEventFormSteps } from "@/hooks/eventForm/useEventFormSteps";
import { hasEventFormChanges, toEventFormData } from "@/lib/events/form";
import { EDIT_STEP_SCHEMAS } from "@/lib/events/form-zod-schema";
import type { EventFormValues } from "@/types/event.types";

// Starts from the saved event, and the last step saves the changes, then opens the event page.
export function useEditEventForm(defaultValues: EventFormValues, slug: string) {
    const router = useRouter();
    const { setIsNavbarDisabled } = useNavbarLock();
    const [isSaving, setIsSaving] = useState(false);

    const { form, step, goToStep, goBack, resetSteps, handleSubmit, handleChange, handleKeyDown } = useEventFormSteps({
        defaultValues,
        schemas: EDIT_STEP_SCHEMAS,
        isSubmitting: isSaving,
        onLastStepSubmit: () => save(),
    });

    // cacheComponents keeps a visited page mounted but hidden, so its state would survive to the
    // next visit. Showing the page fills the form with the event as it's saved now, and hiding it
    // runs the cleanup, so the next visit starts at step 1. Layout effects run before paint, so
    // the old step never flashes.
    useLayoutEffect(() => {
        form.reset(defaultValues);
        return () => {
            resetSteps(defaultValues);
            setIsSaving(false);
        };
    }, [form, defaultValues, resetSteps]);

    const save = async () => {
        setIsSaving(true);
        setIsNavbarDisabled(true);

        try {
            const res = await fetch(`/api/events/${slug}`, { method: "PATCH", body: toEventFormData(form.getValues()) });

            if (res.ok) {
                // The navbar lives in the layout, so it's unlocked here. The buttons stay disabled
                // until the event page opens, so a second click can't save again.
                setIsNavbarDisabled(false);
                router.push(`/events/${slug}`);
                return;
            }

            const data = await res.json().catch(() => ({}));
            console.error("Save event failed:", data.message ?? res.status);
        } catch (error) {
            console.error("Save event failed:", error);
        }

        setIsSaving(false);
        setIsNavbarDisabled(false);
    };

    // Save changes shows only once saving would change the saved event. useWatch re-renders on
    // every edit, so the check below always reads the latest values.
    useWatch({ control: form.control });
    const hasChanges = hasEventFormChanges(form.getValues(), defaultValues);

    return { form, step, isSaving, hasChanges, goBack, goToStep, handleSubmit, handleChange, handleKeyDown };
}
