"use client";
import EventWizard from "@/components/eventForm/EventWizard";
import Button from "@/components/ui/Button";
import { useCreateEventForm } from "@/hooks/eventForm/useCreateEventForm";
import { TOTAL_STEPS } from "@/lib/events/form";

const CreateEventForm = () => {
    const { form, step, isSubmitting, formError, goBack, goToStep, handleSubmit, handleChange, handleKeyDown } = useCreateEventForm();

    return (
        <EventWizard
            form={form}
            step={step}
            variant="create"
            onGoToStep={goToStep}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            formError={formError}
            busyLabel={isSubmitting ? "Publishing…" : null}
            actions={
                <>
                    {step > 1 && <Button variant="secondary" onClick={goBack}>← Back</Button>}
                    {step < TOTAL_STEPS ? (
                        <Button type="submit" className="px-6.5">Continue →</Button>
                    ) : (
                        <Button type="submit" className="px-6.5">Publish event</Button>
                    )}
                </>
            }
        />
    );
};

export default CreateEventForm;
