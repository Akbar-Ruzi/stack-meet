"use client";
import EventWizard from "@/components/eventForm/EventWizard";
import Button from "@/components/ui/Button";
import { useCreateEventForm } from "@/hooks/eventForm/useCreateEventForm";
import { TOTAL_STEPS } from "@/lib/events/form";

const CreateEventForm = () => {
    const { form, step, isSubmitting, goBack, goToStep, handleSubmit, handleChange, handleKeyDown } = useCreateEventForm();

    return (
        <EventWizard
            form={form}
            step={step}
            variant="create"
            onGoToStep={goToStep}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            actions={
                <>
                    {step > 1 && <Button variant="secondary" onClick={goBack} disabled={isSubmitting}>← Back</Button>}
                    {step < TOTAL_STEPS ? (
                        <Button type="submit" className="px-6.5">Continue →</Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting} className="px-6.5">
                            {isSubmitting ? "Publishing..." : "Publish event"}
                        </Button>
                    )}
                </>
            }
        />
    );
};

export default CreateEventForm;
