import { useState } from "react";

import { useNavbarLock } from "@/context/navbar-lock-context";
import { useEventFormSteps } from "@/hooks/eventForm/useEventFormSteps";
import { EVENT_FORM_DEFAULTS, toEventFormData } from "@/lib/events/form";
import { STEP_SCHEMAS } from "@/lib/events/form-zod-schema";
import { toastAfterPageLoad } from "@/lib/toast";

const TRY_LATER_MESSAGE = "Couldn't publish right now. Please try again in a few minutes.";

// Starts empty, and the last step publishes. On success it opens the new event's page.
// A failed publish keeps everything typed and returns formError, shown above the buttons.
export function useCreateEventForm() {
    const { setIsNavbarDisabled } = useNavbarLock();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const { form, step, goToStep, goBack, handleSubmit, handleChange, handleKeyDown } = useEventFormSteps({
        defaultValues: EVENT_FORM_DEFAULTS,
        schemas: STEP_SCHEMAS,
        isSubmitting,
        onLastStepSubmit: () => publish(),
    });

    const stopSubmitting = (message: string) => {
        setFormError(message);
        setIsSubmitting(false);
        setIsNavbarDisabled(false);
    };

    const publish = async () => {
        setIsSubmitting(true);
        setIsNavbarDisabled(true);
        setFormError(null);

        try {
            // getValues, because the resolver only returns the fields of the last step.
            const res = await fetch("/api/events", { method: "POST", body: toEventFormData(form.getValues()) });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                // A 4xx message is written for the user (e.g. the title is taken). A 5xx only says
                // "Event Creation Failed", so the user is asked to try again later instead.
                stopSubmitting(res.status < 500 && data?.message ? data.message : TRY_LATER_MESSAGE);
                return;
            }

            const slug: unknown = data?.event?.slug;
            if (typeof slug !== "string") {
                stopSubmitting(TRY_LATER_MESSAGE);
                return;
            }

            // A full page load, not router.push: this page stays mounted in the background, so it
            // would still be locked with the old values the next time Create event opens.
            // The form stays covered with "Publishing…" until the event page loads.
            toastAfterPageLoad("Your event is live.");
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign(`/events/${encodeURIComponent(slug)}`);
        } catch (error) {
            // No response at all: the network failed or the server couldn't be reached.
            console.error("Create event failed:", error);
            stopSubmitting(TRY_LATER_MESSAGE);
        }
    };

    return { form, step, isSubmitting, formError, goBack, goToStep, handleSubmit, handleChange, handleKeyDown };
}
