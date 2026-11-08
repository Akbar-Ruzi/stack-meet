import type { ComponentProps } from "react";

type AuthFieldProps = ComponentProps<"input"> & {
    id: string;
    label: string;
    hint?: string;
};

const AuthField = ({ id, label, hint, ...inputProps }: AuthFieldProps) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={id} className="font-mono text-xs text-muted">{label}</label>
        <input
            id={id}
            className="h-12.5 rounded-[10px] border border-border bg-field px-3.5 font-sans text-base text-text placeholder:text-[#757575]"
            {...inputProps}
        />
        {hint && <span className="text-[13px] text-muted">{hint}</span>}
    </div>
);

export default AuthField;
