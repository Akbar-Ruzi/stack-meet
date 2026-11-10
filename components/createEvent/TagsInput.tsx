import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import type { EventFormValues } from "@/types/event.types";

const cleanTag = (value: string) => value.trim().toLowerCase().replace(/^#+/, "");

const TagsInput = ({ control }: { control: Control<EventFormValues> }) => {
    const { field } = useController({ control, name: "tags" });
    const [draft, setDraft] = useState("");

    const addDraft = () => {
        const tag = cleanTag(draft);
        if (tag && !field.value.includes(tag)) field.onChange([...field.value, tag]);
        setDraft("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addDraft();
        }
        if (e.key === "Backspace" && !draft) field.onChange(field.value.slice(0, -1));
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="event-tags" className="text-[15px] font-medium">Tags</label>
            <div className="flex min-h-12.5 flex-wrap items-center gap-2 rounded-[10px] border border-border bg-field px-2.5 py-2">
                {field.value.map((tag) => (
                    <span key={tag} className="rounded-full border border-accent px-2.5 py-1.5 font-mono text-[13px]">#{tag}</span>
                ))}
                <input
                    id="event-tags"
                    type="text"
                    value={draft}
                    placeholder="Add a tag and press Enter"
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addDraft}
                    className="h-8 min-w-40 flex-1 bg-transparent text-[15px] text-text"
                />
            </div>
        </div>
    );
};

export default TagsInput;
