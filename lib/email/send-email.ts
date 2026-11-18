import "server-only";

import { Resend } from "resend";

// Resend's shared test sender. It can only send to the address the Resend account was made
// with, until a domain is verified and EMAIL_FROM is set to an address on it.
const DEFAULT_FROM = "StackMeet <onboarding@resend.dev>";

type EmailMessage = {
    to: string;
    subject: string;
    html: string;
    text: string;
};

// Sends one email through Resend and returns its Resend ID.
// Throws when RESEND_API_KEY is missing or Resend refuses the email.
export async function sendEmail({ to, subject, html, text }: EmailMessage): Promise<string> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not set.");

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to,
        subject,
        html,
        text,
    });

    if (error) throw new Error(`Resend refused the email: ${error.message}`);
    return data.id;
}
