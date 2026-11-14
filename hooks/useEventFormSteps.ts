import { useState } from "react";
import { flushSync } from "react-dom";
import { useForm, type FieldValues, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { TOTAL_STEPS } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

type EventFormStepsOptions = {
    defaultValues: EventFormValues;
    schemas: z.ZodType<FieldValues, FieldValues>[]; // one per step, each checking an object of fields
    allStepsUnlocked: boolean; // false: only finished steps can be reopened
    isSubmitting: boolean;
};

// The step on screen, the form, and moving between steps. Continue checks only the step on screen.
export function useEventFormSteps({ defaultValues, schemas, allStepsUnlocked, isSubmitting }: EventFormStepsOptions) {
    const [step, setStep] = useState(1);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(schemas[step - 1]) as unknown as Resolver<EventFormValues>,
        defaultValues,
    });

    // Resolves true when the step was valid and the next one is now showing.
    const goNext = async () => {
        const stepIsValid = await form.trigger(undefined, { shouldFocus: true });
        if (!stepIsValid || step === TOTAL_STEPS) return false;
        setStep((current) => current + 1);
        return true;
    };

    // When steps are locked, only finished ones can be reopened, so Continue's check can't be skipped.
    const goToStep = (target: number) => {
        if (target === step || isSubmitting) return;
        if (!allStepsUnlocked && target > step) return;
        form.clearErrors();
        setStep(target);
    };

    const goBack = () => goToStep(step - 1);

    // Unlocked steps can be skipped, so saving checks every step, not only the one on screen.
    // Returns false and opens the first step with a problem, showing its errors there.
    const validateAllSteps = () => {
        const values = form.getValues();

        for (const [index, schema] of schemas.entries()) {
            const { error } = schema.safeParse(values);
            if (!error) continue;

            // The step is shown before the errors are set, so the first field can take focus.
            flushSync(() => setStep(index + 1));
            form.clearErrors();
            error.issues.forEach((issue, issueIndex) => {
                const name = issue.path.join(".") as Path<EventFormValues>;
                form.setError(name, { type: issue.code, message: issue.message }, { shouldFocus: issueIndex === 0 });
            });
            return false;
        }

        return true;
    };

    const resetSteps = (values: EventFormValues) => {
        form.reset(values);
        setStep(1);
    };

    // A field's error goes away as soon as it's edited.
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const name = e.target.name as Path<EventFormValues> | "";
        if (name) form.clearErrors(name);
    };

    return { form, step, goNext, goToStep, goBack, validateAllSteps, resetSteps, handleChange };
}
