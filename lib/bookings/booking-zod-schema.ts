import { z } from "zod";
import { EMAIL_REGEX } from "@/lib/constants";

// The booking rules, shared by the form and the createBooking Server Action, so both check the same thing.

const MAX_NAME_LENGTH = 50;
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;
const PHONE_REGEX = /^\+?[\d\s().-]+$/;

const isValidPhone = (phone: string) => {
    const digitCount = phone.replace(/\D/g, "").length;
    return PHONE_REGEX.test(phone) && digitCount >= MIN_PHONE_DIGITS && digitCount <= MAX_PHONE_DIGITS;
};

// Server Actions can be called directly, so a value may be missing or not a string. Those get the "required" message.
export const bookingSchema = z.object({
    name: z
        .string({ error: "Name is required." })
        .trim()
        .min(1, { error: "Name is required.", abort: true })
        .max(MAX_NAME_LENGTH, `Name cannot exceed ${MAX_NAME_LENGTH} characters.`),
    email: z
        .string({ error: "Email is required." })
        .trim()
        .toLowerCase()
        .min(1, { error: "Email is required.", abort: true })
        .regex(EMAIL_REGEX, "Please enter a valid email address."),
    phone: z
        .string({ error: "Please enter a valid phone number." })
        .trim()
        .default("")
        .refine((phone) => !phone || isValidPhone(phone), "Please enter a valid phone number."),
});

export type BookingValues = z.input<typeof bookingSchema>;
export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

// The first message for each field, in the shape the form shows them.
export function toBookingErrors(error: z.ZodError<BookingValues>): BookingErrors {
    const { fieldErrors } = z.flattenError(error);
    return {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
    };
}
