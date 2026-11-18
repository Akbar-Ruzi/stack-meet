type VerificationEmailContent = { subject: string; html: string; text: string };

// An email address can contain characters such as < and &, so it's escaped before going into HTML.
const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The email that asks a new user to verify their address.
export function verificationEmail({ email, link, hours }: { email: string; link: string; hours: number }): VerificationEmailContent {
    const intro = `Click the link below to verify ${email}. It expires in ${hours} hours.`;
    const ignore = "If you didn't create a StackMeet account, ignore this email.";

    return {
        subject: "Verify your StackMeet email",
        html: [
            `<p>Click the link below to verify ${escapeHtml(email)}. It expires in ${hours} hours.</p>`,
            `<p><a href="${escapeHtml(link)}">Verify my email</a></p>`,
            `<p>${ignore}</p>`,
        ].join(""),
        text: `${intro}\n\n${link}\n\n${ignore}`,
    };
}
