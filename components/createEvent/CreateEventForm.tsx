"use client";
import AudienceStep from "@/components/createEvent/AudienceStep";
import BasicsStep from "@/components/createEvent/BasicsStep";
import WhenWhereStep from "@/components/createEvent/WhenWhereStep";
import Button from "@/components/ui/Button";
import { useCreateEventForm } from "@/hooks/useCreateEventForm";
import { TOTAL_STEPS } from "@/lib/event-form";

const CreateEventForm = () => {
    const { form, step, isSubmitting, goBack, handleSubmit, handleChange, handleKeyDown } = useCreateEventForm();

    return (
        <form
            id="create-event-form"
            onSubmit={handleSubmit}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            noValidate
            className="flex min-w-0 flex-[999_1_600px] flex-col gap-6"
        >
            <BasicsStep form={form} active={step === 1} />
            <WhenWhereStep form={form} active={step === 2} />
            <AudienceStep form={form} active={step === 3} />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[13px] text-muted">step {step} of {TOTAL_STEPS}</span>
                <div className="flex flex-wrap gap-3">
                    {step > 1 && <Button variant="secondary" onClick={goBack} disabled={isSubmitting}>← Back</Button>}
                    {step < TOTAL_STEPS ? (
                        <Button type="submit" className="px-6.5">Continue →</Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting} className="px-6.5">
                            {isSubmitting ? "Publishing..." : "Publish event"}
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CreateEventForm;
