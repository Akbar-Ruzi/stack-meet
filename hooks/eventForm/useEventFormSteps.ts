import { useCallback, useRef, useState } from "react";
import { useForm, type FieldValues, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { TOTAL_STEPS } from "@/lib/events/form";
import type { EventFormValues } from "@/types/event.types";

// The last step's button takes Continue's place, so the second click of a double-click would land on it.
const LAST_STEP_GUARD_MS = 500;

type EventFormStepsOptions = {
    defaultValues: EventFormValues;
    schemas: z.ZodType<FieldValues, FieldValues>[]; // one per step, each checking an object of fields
    isSubmitting: boolean;
    onLastStepSubmit: () => Promise<void>; // runs once the last step passes its check
};

// The step on screen, the form, and moving between steps. Steps unlock one at a time:
// Continue checks only the step on screen, and the last step's button submits.
export function useEventFormSteps({ defaultValues, schemas, isSubmitting, onLastStepSubmit }: EventFormStepsOptions) {
    const [step, setStep] = useState(1);
    const reachedLastStepAt = useRef(0);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(schemas[step - 1]) as unknown as Resolver<EventFormValues>,
        defaultValues,
    });

    const goNext = async () => {
        const stepIsValid = await form.trigger(undefined, { shouldFocus: true });
        if (!stepIsValid) return;
        if (step + 1 === TOTAL_STEPS) reachedLastStepAt.current = Date.now();
        setStep((current) => current + 1);
    };

    // Only finished steps can be reopened, so Continue's check can't be skipped.
    const goToStep = (target: number) => {
        if (target >= step || isSubmitting) return;
        form.clearErrors();
        setStep(target);
    };

    const goBack = () => goToStep(step - 1);

    // Stable, so the edit form can run it from an effect.
    const resetSteps = useCallback(
        (values: EventFormValues) => {
            form.reset(values);
            setStep(1);
        },
        [form],
    );

    // Enter continues on the earlier steps. On the last one it does nothing, so
    // the form only submits from its button.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && step === TOTAL_STEPS && e.target instanceof HTMLInputElement) e.preventDefault();
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        if (step < TOTAL_STEPS) {
            e.preventDefault();
            goNext();
            return;
        }
        if (Date.now() - reachedLastStepAt.current < LAST_STEP_GUARD_MS) {
            e.preventDefault();
            return;
        }
        form.handleSubmit(onLastStepSubmit)(e);
    };

    // A field's error goes away as soon as it's edited.
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const name = e.target.name as Path<EventFormValues> | "";
        if (name) form.clearErrors(name);
    };

    return { form, step, goToStep, goBack, resetSteps, handleSubmit, handleChange, handleKeyDown };
}
