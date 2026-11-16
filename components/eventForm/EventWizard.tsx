import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import AudienceStep from "@/components/eventForm/AudienceStep";
import BasicsStep from "@/components/eventForm/BasicsStep";
import EventPreview from "@/components/eventForm/EventPreview";
import StepProgress from "@/components/eventForm/StepProgress";
import WhenWhereStep from "@/components/eventForm/WhenWhereStep";
import { FieldError } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
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
    formError?: string | null; // a failed request, shown right above the buttons
    busyLabel?: string | null; // while sending (e.g. "Publishing…"): locks the form and covers it with this text
};

// The three steps, the progress bar and the preview, shared by Create event and Edit event.
const EventWizard = ({ form, step, variant, savedEvent, onGoToStep, onSubmit, onChange, onKeyDown, actions, formError, busyLabel }: EventWizardProps) => (
    <>
        <div className="mx-auto max-w-312 px-6 pb-8">
            <StepProgress step={step} onGoToStep={onGoToStep} />
        </div>

        <section className="mx-auto flex max-w-312 flex-wrap items-start gap-10 px-6 pb-24">
            <form
                id={`${variant}-event-form`}
                onSubmit={onSubmit}
                onChange={onChange}
                onKeyDown={onKeyDown}
                noValidate
                aria-busy={Boolean(busyLabel)}
                className="relative min-w-0 flex-[999_1_600px]"
            >
                {/* While sending, the fieldset disables every field and button, and the status covers the form. */}
                <fieldset disabled={Boolean(busyLabel)} className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0">
                    <BasicsStep form={form} active={step === 1} />
                    <WhenWhereStep form={form} active={step === 2} />
                    <AudienceStep form={form} active={step === 3} />

                    <div>
                        {/* Always rendered, so screen readers announce the message when it appears. */}
                        <div role="alert">
                            {formError && <div className="mb-3"><FieldError message={formError} /></div>}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="font-mono text-[13px] text-muted">step {step} of {TOTAL_STEPS}</span>
                            <div className="flex flex-wrap gap-3">{actions}</div>
                        </div>
                    </div>
                </fieldset>

                {/* Always rendered, so screen readers announce the text when it appears. The label is
                    sticky at both ends, so it stays in the middle of the screen on a form taller than it. */}
                <div role="status" className="pointer-events-none absolute inset-0">
                    {busyLabel && (
                        <div className="pointer-events-auto flex size-full flex-col justify-center rounded-xl bg-bg/75 backdrop-blur-[2px]">
                            <div className="sticky top-[calc(50vh-14px)] bottom-[calc(50vh-14px)] flex items-center justify-center gap-2.5 text-[17px] font-bold text-text">
                                <Spinner size={20} />
                                {busyLabel}
                            </div>
                        </div>
                    )}
                </div>
            </form>

            <EventPreview form={form} variant={variant} savedEvent={savedEvent} />
        </section>
    </>
);

export default EventWizard;
