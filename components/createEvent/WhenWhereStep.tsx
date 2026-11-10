import { useWatch, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import ModeSwitch from "@/components/createEvent/ModeSwitch";
import StepFields from "@/components/createEvent/StepFields";
import type { EventFormValues } from "@/types/event.types";

const ROW_CLASSES = "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4";

const WhenWhereStep = ({ form, active }: { form: UseFormReturn<EventFormValues>; active: boolean }) => {
    const { errors } = form.formState;
    const mode = useWatch({ control: form.control, name: "mode" });

    return (
        <StepFields active={active}>
            <div className={ROW_CLASSES}>
                <Input id="event-date" label="Date" type="date" required error={errors.date?.message} {...form.register("date")} />
                <Input id="event-time" label="Start time" type="time" required error={errors.time?.message} {...form.register("time")} />
            </div>
            <ModeSwitch control={form.control} />
            {mode !== "online" && (
                <div className={ROW_CLASSES}>
                    <Input id="event-venue" label="Venue" required placeholder="e.g. Moscone Center" error={errors.venue?.message} {...form.register("venue")} />
                    <Input id="event-location" label="City" required placeholder="e.g. Washington, DC" error={errors.location?.message} {...form.register("location")} />
                </div>
            )}
            {mode !== "in-person" && (
                <Input id="event-online-url" label="Online link" type="url" placeholder="https:// — sent to attendees after booking" {...form.register("onlineUrl")} />
            )}
        </StepFields>
    );
};

export default WhenWhereStep;
