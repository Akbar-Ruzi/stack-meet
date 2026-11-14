import { useState } from "react";
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

    const resetSteps = (values: EventFormValues) => {
        form.reset(values);
        setStep(1);
    };

    // A field's error goes away as soon as it's edited.
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const name = e.target.name as Path<EventFormValues> | "";
        if (name) form.clearErrors(name);
    };

    return { form, step, goNext, goToStep, goBack, resetSteps, handleChange };
}
