"use client";
import EventWizard from "@/components/createEvent/EventWizard";
import Button from "@/components/ui/Button";
import { useEditEventForm } from "@/hooks/useEditEventForm";
import { TOTAL_STEPS } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

type EditEventFormProps = {
    defaultValues: EventFormValues;
    savedEvent: { slug: string; image: string };
};

const EditEventForm = ({ defaultValues, savedEvent }: EditEventFormProps) => {
    const { form, step, goBack, goToStep, handleSubmit, handleChange } = useEditEventForm(defaultValues);

    return (
        <EventWizard
            form={form}
            step={step}
            variant="edit"
            savedEvent={savedEvent}
            onGoToStep={goToStep}
            onSubmit={handleSubmit}
            onChange={handleChange}
            actions={
                <>
                    {step > 1 && <Button variant="secondary" onClick={goBack}>← Back</Button>}
                    {step < TOTAL_STEPS && <Button type="submit" className="px-6.5">Continue →</Button>}
                </>
            }
        />
    );
};

export default EditEventForm;
