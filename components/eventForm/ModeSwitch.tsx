import { useController, type Control } from "react-hook-form";
import type { EventFormValues } from "@/types/event.types";
import type { EventMode } from "@/lib/events/search";
import { FORMAT_LABELS } from "@/lib/events/display";

const OPTIONS: { value: EventMode; selectedClasses: string }[] = [
    { value: "online", selectedClasses: "bg-format-online" },
    { value: "in-person", selectedClasses: "bg-format-in-person" },
    { value: "hybrid", selectedClasses: "bg-format-hybrid" },
];

const ModeSwitch = ({ control }: { control: Control<EventFormValues> }) => {
    const { field } = useController({ control, name: "mode" });

    return (
        <div role="radiogroup" aria-label="Format" className="flex flex-col gap-2">
            <span className="text-[15px] font-medium">Format <span className="text-accent">*</span></span>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-field p-1">
                {OPTIONS.map(({ value, selectedClasses }) => {
                    const selected = field.value === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => field.onChange(value)}
                            className={`min-h-11 cursor-pointer rounded-lg text-[15px] font-bold ${selected ? `${selectedClasses} text-on-accent` : "text-muted"}`}
                        >
                            {FORMAT_LABELS[value]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ModeSwitch;
