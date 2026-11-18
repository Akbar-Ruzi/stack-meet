// Sends one test email through lib/email/send-email.ts, to check the Resend setup.
// Run: npm run email:test -- you@example.com
// Until a domain is verified in Resend, the address must be the one the Resend account uses.
import { sendEmail } from "../lib/email/send-email.ts";

const to = process.argv[2];
if (!to) {
    console.error("Usage: npm run email:test -- you@example.com");
    process.exit(1);
}

try {
    const id = await sendEmail({
        to,
        subject: "StackMeet test email",
        html: "<p>If you can read this, StackMeet can send email.</p>",
        text: "If you can read this, StackMeet can send email.",
    });
    console.log(`Sent to ${to}. Resend ID: ${id}`);
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    // Not process.exit(): on Windows it crashes Node while the request's connection is still closing.
    process.exitCode = 1;
}
