import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import AudienceStep from "@/components/eventForm/AudienceStep";
import BasicsStep from "@/components/eventForm/BasicsStep";
import EventPreview from "@/components/eventForm/EventPreview";
import StepProgress from "@/components/eventForm/StepProgress";
import WhenWhereStep from "@/components/eventForm/WhenWhereStep";
import { TOTAL_STEPS } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

type EventWizardProps = {
    form: UseFormReturn<EventFormValues>;
    step: number;
    variant: "create" | "edit";
    savedEvent?: { slug: string; image: string }; // when editing
    onGoToStep: (target: number) => void;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLFormElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void;
    actions: ReactNode; // the buttons at the bottom right
};

// The three steps, the progress bar and the preview, shared by Create event and Edit event.
const EventWizard = ({ form, step, variant, savedEvent, onGoToStep, onSubmit, onChange, onKeyDown, actions }: EventWizardProps) => (
    <>
        <div className="mx-auto max-w-312 px-6 pb-8">
            <StepProgress step={step} onGoToStep={onGoToStep} allStepsUnlocked={variant === "edit"} />
        </div>

        <section className="mx-auto flex max-w-312 flex-wrap items-start gap-10 px-6 pb-24">
            <form
                id={`${variant}-event-form`}
                onSubmit={onSubmit}
                onChange={onChange}
                onKeyDown={onKeyDown}
                noValidate
                className="flex min-w-0 flex-[999_1_600px] flex-col gap-6"
            >
                <BasicsStep form={form} active={step === 1} />
                <WhenWhereStep form={form} active={step === 2} />
                <AudienceStep form={form} active={step === 3} />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[13px] text-muted">step {step} of {TOTAL_STEPS}</span>
                    <div className="flex flex-wrap gap-3">{actions}</div>
                </div>
            </form>

            <EventPreview form={form} variant={variant} savedEvent={savedEvent} />
        </section>
    </>
);

export default EventWizard;
