"use client";
import Link from "next/link";
import EventWizard from "@/components/eventForm/EventWizard";
import Button from "@/components/ui/Button";
import { useEditEventForm } from "@/hooks/eventForm/useEditEventForm";
import { TOTAL_STEPS } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

type EditEventFormProps = {
    defaultValues: EventFormValues;
    savedEvent: { slug: string; image: string };
};

const EditEventForm = ({ defaultValues, savedEvent }: EditEventFormProps) => {
    const { form, step, isSaving, hasChanges, goBack, goToStep, handleSubmit, handleChange, handleKeyDown } =
        useEditEventForm(defaultValues, savedEvent.slug);

    return (
        <EventWizard
            form={form}
            step={step}
            variant="edit"
            savedEvent={savedEvent}
            onGoToStep={goToStep}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            actions={
                <>
                    <Link href="/my-events" className="inline-flex min-h-13 items-center px-3 text-base text-muted">
                        Cancel
                    </Link>
                    {step > 1 && <Button variant="secondary" onClick={goBack} disabled={isSaving}>← Back</Button>}
                    {step < TOTAL_STEPS ? (
                        <Button type="submit" className="px-6.5">Continue →</Button>
                    ) : hasChanges ? (
                        <Button type="submit" disabled={isSaving} className="px-6.5">
                            {isSaving ? "Saving..." : "Save changes"}
                        </Button>
                    ) : (
                        <span className="inline-flex min-h-13 items-center px-3 text-base text-muted">No changes yet</span>
                    )}
                </>
            }
        />
    );
};

export default EditEventForm;
