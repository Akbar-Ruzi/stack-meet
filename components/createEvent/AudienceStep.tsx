import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import AgendaFields from "@/components/createEvent/AgendaFields";
import StepFields from "@/components/createEvent/StepFields";
import TagsInput from "@/components/createEvent/TagsInput";
import type { EventFormValues } from "@/types/event.types";

const AudienceStep = ({ form, active }: { form: UseFormReturn<EventFormValues>; active: boolean }) => {
    const { errors } = form.formState;

    return (
        <StepFields active={active}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <Input id="event-organizer" label="Organizer" required placeholder="Your name or group" error={errors.organizer?.message} {...form.register("organizer")} />
                <Input id="event-audience" label="Audience" required placeholder="e.g. Beginner to intermediate devs" error={errors.audience?.message} {...form.register("audience")} />
            </div>
            <TagsInput control={form.control} />
            <AgendaFields form={form} />
        </StepFields>
    );
};

export default AudienceStep;
