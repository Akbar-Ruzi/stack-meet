import type { ReactNode } from "react";
import { FORM_STEPS } from "@/lib/events/form";

type StepFieldsProps = {
    active: boolean;
    step: number;
    children: ReactNode;
};

// The box around one step. Steps stay mounted while hidden, so typed values and the chosen file are kept.
const StepFields = ({ active, step, children }: StepFieldsProps) => {
    const { title, description } = FORM_STEPS[step - 1];

    return (
        <fieldset hidden={!active} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-7">
            <legend className="float-left mb-1 flex w-full items-center gap-4 border-b border-line pb-5">
                <span aria-hidden="true" className="flex size-12 flex-none items-center justify-center rounded-[12px] bg-accent font-mono text-xl font-medium text-on-accent">
                    {String(step).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1">
                    <span className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em]">{title}</span>
                    <span className="text-[15px] text-muted">{description}</span>
                </span>
            </legend>
            {children}
        </fieldset>
    );
};

export default StepFields;
