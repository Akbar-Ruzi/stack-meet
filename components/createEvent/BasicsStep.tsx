import type { UseFormReturn } from "react-hook-form";
import { Input, Textarea } from "@/components/ui/Input";
import CoverImageField from "@/components/createEvent/CoverImageField";
import StepFields from "@/components/createEvent/StepFields";
import type { EventFormValues } from "@/types/event.types";

const BasicsStep = ({ form, active }: { form: UseFormReturn<EventFormValues>; active: boolean }) => {
    const { errors } = form.formState;

    return (
        <StepFields active={active}>
            <Input id="event-title" label="Title" required error={errors.title?.message} {...form.register("title")} />
            <Input
                id="event-description"
                label="Short description"
                required
                placeholder="One line that appears under the title"
                error={errors.description?.message}
                {...form.register("description")}
            />
            <Textarea
                id="event-overview"
                label="Overview"
                required
                placeholder="What attendees will do, who it's for, what to bring"
                error={errors.overview?.message}
                {...form.register("overview")}
            />
            <CoverImageField form={form} />
        </StepFields>
    );
};

export default BasicsStep;
