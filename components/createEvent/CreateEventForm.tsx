"use client";
import AudienceStep from "@/components/createEvent/AudienceStep";
import BasicsStep from "@/components/createEvent/BasicsStep";
import EventPreview from "@/components/createEvent/EventPreview";
import StepProgress from "@/components/createEvent/StepProgress";
import WhenWhereStep from "@/components/createEvent/WhenWhereStep";
import Button from "@/components/ui/Button";
import { useCreateEventForm } from "@/hooks/useCreateEventForm";
import { TOTAL_STEPS } from "@/lib/events/form";

const CreateEventForm = () => {
    const { form, step, isSubmitting, goBack, goToStep, handleSubmit, handleChange, handleKeyDown } = useCreateEventForm();

    return (
        <>
            <div className="mx-auto max-w-312 px-6 pb-8">
                <StepProgress step={step} onGoToStep={goToStep} />
            </div>

            <section className="mx-auto flex max-w-312 flex-wrap items-start gap-10 px-6 pb-24">
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

                <EventPreview control={form.control} />
            </section>
        </>
    );
};

export default CreateEventForm;
