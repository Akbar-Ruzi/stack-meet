import type { ReactNode } from "react";

// The box around one step. Steps stay mounted while hidden, so typed values and the chosen file are kept.
const StepFields = ({ active, children }: { active: boolean; children: ReactNode }) => (
    <fieldset hidden={!active} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-7">
        {children}
    </fieldset>
);

export default StepFields;
