import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

// Shown on the booking card instead of the form when nobody is signed in.
// Sign-in sends the visitor back to this event afterwards.
const SignInToBook = ({ slug }: { slug: string }) => (
    <Link
        href={`/auth/sign-in?${new URLSearchParams({ next: `/events/${slug}` })}`}
        className={buttonClasses({ className: "mt-6 w-full gap-2" })}
    >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Sign in to book
    </Link>
);

export default SignInToBook;
