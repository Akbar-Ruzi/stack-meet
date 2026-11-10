import { FORM_STEPS } from "@/lib/events/form";

const dotClasses = (stepNumber: number, currentStep: number) => {
    if (stepNumber < currentStep) return "bg-accent text-on-accent";
    if (stepNumber === currentStep) return "border-2 border-accent text-accent";
    return "border border-border text-muted";
};

const StepProgress = ({ step, onGoToStep }: { step: number; onGoToStep: (target: number) => void }) => (
    <ol aria-label="Progress" className="mt-9 grid max-w-200 grid-cols-3 gap-3 max-sm:hidden">
        {FORM_STEPS.map(({ title }, index) => {
            const stepNumber = index + 1;
            const locked = stepNumber > step;

            return (
                <li key={title} aria-current={stepNumber === step ? "step" : undefined} className="flex flex-col gap-2.5">
                    <span aria-hidden="true" className={`h-1 rounded-[4px] ${locked ? "bg-border" : "bg-accent"}`} />
                    <button
                        type="button"
                        onClick={() => onGoToStep(stepNumber)}
                        disabled={locked}
                        className={`flex min-h-11 items-center gap-2.5 text-left ${locked ? "cursor-default" : "cursor-pointer"}`}
                    >
                        <span className={`flex size-7 flex-none items-center justify-center rounded-full font-mono text-[13px] font-medium ${dotClasses(stepNumber, step)}`}>
                            {stepNumber < step ? "✓" : stepNumber}
                        </span>
                        <span className="flex flex-col">
                            <span className="font-mono text-[11px] text-muted">step {stepNumber}</span>
                            <span className={`text-[15px] font-bold ${locked ? "text-muted" : "text-text"}`}>{title}</span>
                        </span>
                    </button>
                </li>
            );
        })}
    </ol>
);

export default StepProgress;
