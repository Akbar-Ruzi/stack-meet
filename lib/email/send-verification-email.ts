import "server-only";

import { saveEmailVerificationToken } from "@/lib/data/users";
import { sendEmail } from "@/lib/email/send-email";
import { verificationEmail } from "@/lib/email/verification-email";
import { createVerificationToken } from "@/lib/email/verification-token";

const LINK_LIFETIME_HOURS = 24;
const VERIFY_EMAIL_PATH = "/auth/verify-email";

// Makes a new verification link for the user, saves its token's hash (replacing the old link),
// and emails it. Throws when NEXT_PUBLIC_BASE_URL is missing or the email can't be sent.
export async function sendVerificationEmail(userId: string, email: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not set.");

    const { token, hash } = createVerificationToken();
    const expiresAt = new Date(Date.now() + LINK_LIFETIME_HOURS * 60 * 60 * 1000);
    await saveEmailVerificationToken(userId, hash, expiresAt);

    const link = `${baseUrl}${VERIFY_EMAIL_PATH}?${new URLSearchParams({ token })}`;
    await sendEmail({ to: email, ...verificationEmail({ email, link, hours: LINK_LIFETIME_HOURS }) });
}
