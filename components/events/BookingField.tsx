import type { ComponentProps } from "react";
import { FieldError } from "@/components/ui/Input";

type BookingFieldProps = ComponentProps<"input"> & {
    id: string;
    label: string;
    optional?: boolean;
    hint?: string;
    error?: string;
};

// Returns siblings rather than a wrapper, so the form's spacing applies to each line.
const BookingField = ({ id, label, optional, hint, error, ...inputProps }: BookingFieldProps) => {
    const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

    return (
        <>
            <label htmlFor={id} className="font-mono text-xs text-muted not-first:mt-1.5">
                {label} {optional && <span className="opacity-80">(optional)</span>}
            </label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={`h-12.5 rounded-[10px] border bg-field px-3.5 font-sans text-base text-text placeholder:text-[#757575] ${error ? "border-danger-border" : "border-border"}`}
                {...inputProps}
            />
            {hint && <span id={`${id}-hint`} className="text-[13px] text-muted">{hint}</span>}
            {error && <FieldError id={`${id}-error`} message={error} />}
        </>
    );
};

export default BookingField;
