import { useWatch, type UseFormReturn } from "react-hook-form";
import { FieldError } from "@/components/ui/Input";
import type { EventFormValues } from "@/types/event.types";

const CoverImageField = ({ form }: { form: UseFormReturn<EventFormValues> }) => {
    const files = useWatch({ control: form.control, name: "image" });
    const fileName = files?.[0]?.name;
    const error = form.formState.errors.image?.message;

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[15px] font-medium">Cover image <span className="text-accent">*</span></span>
            <label
                htmlFor="event-image"
                className={`relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-bg p-5 text-center focus-within:border-accent ${error ? "border-danger-border" : "border-[#2F3631]"}`}
            >
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V4M7 9l5-5 5 5" />
                    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
                <span className="text-[15px]">Drop an image or <span className="text-accent underline">browse</span></span>
                <span className={`font-mono ${fileName ? "text-sm font-medium text-accent" : "text-xs text-muted"}`}>
                    {fileName ?? "PNG or JPG · 16:9 works best"}
                </span>
                {/* Covers the whole box, so dropping a file on it works without extra code. */}
                <input
                    id="event-image"
                    type="file"
                    accept="image/*"
                    aria-invalid={error ? true : undefined}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    {...form.register("image")}
                />
            </label>
            {error && <FieldError message={error} />}
        </div>
    );
};

export default CoverImageField;
