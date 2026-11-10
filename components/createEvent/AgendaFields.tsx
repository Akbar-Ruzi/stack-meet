import { useWatch, type UseFormReturn } from "react-hook-form";
import { FieldError } from "@/components/ui/Input";
import type { EventFormValues } from "@/types/event.types";

const FIELD_CLASSES = "h-11.5 rounded-[10px] border bg-field px-3 text-text";
const borderClass = (error?: string) => (error ? "border-danger-border" : "border-border");

const AgendaFields = ({ form }: { form: UseFormReturn<EventFormValues> }) => {
    const rows = useWatch({ control: form.control, name: "agenda" });
    const rowErrors = form.formState.errors.agenda;

    const addRow = () => {
        const current = form.getValues("agenda");
        form.setValue("agenda", [...current, { time: "", item: "" }]);
        requestAnimationFrame(() => form.setFocus(`agenda.${current.length}.time`));
    };

    return (
        <div className="flex flex-col gap-2.5">
            <span className="text-[15px] font-medium">Agenda</span>
            {/* Rows are only ever added at the end, so the index is a stable key. */}
            {rows.map((_, index) => {
                const timeError = rowErrors?.[index]?.time?.message;
                const itemError = rowErrors?.[index]?.item?.message;
                const error = timeError ?? itemError;

                return (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2.5">
                            <label htmlFor={`agenda-time-${index}`} className="sr-only">Agenda item {index + 1} time</label>
                            <input
                                id={`agenda-time-${index}`}
                                type="time"
                                aria-invalid={timeError ? true : undefined}
                                className={`w-36 font-mono text-[15px] ${FIELD_CLASSES} ${borderClass(timeError)}`}
                                {...form.register(`agenda.${index}.time`)}
                            />
                            <label htmlFor={`agenda-item-${index}`} className="sr-only">Agenda item {index + 1}</label>
                            <input
                                id={`agenda-item-${index}`}
                                type="text"
                                aria-invalid={itemError ? true : undefined}
                                className={`min-w-50 flex-1 text-[15px] ${FIELD_CLASSES} ${borderClass(itemError)}`}
                                {...form.register(`agenda.${index}.item`)}
                            />
                        </div>
                        {error && <FieldError message={error} />}
                    </div>
                );
            })}
            <button
                type="button"
                onClick={addRow}
                className="min-h-11 cursor-pointer self-start rounded-[10px] border border-dashed border-[#2F3631] px-3.5 font-mono text-sm font-medium text-accent"
            >
                + add agenda item
            </button>
        </div>
    );
};

export default AgendaFields;
