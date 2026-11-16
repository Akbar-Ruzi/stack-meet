import Link from "next/link";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { CREATE_EVENT_PATH, SIGN_IN_TO_CREATE_URL } from "@/lib/constants";

type CreateEventLinkProps = { className: string; children: ReactNode };

// Links to Create event, or straight to sign-in for signed-out visitors, so no redirect is needed.
const CreateEventLink = async ({ className, children }: CreateEventLinkProps) => {
    const session = await auth();

    return (
        <Link href={session?.user ? CREATE_EVENT_PATH : SIGN_IN_TO_CREATE_URL} className={className}>
            {children}
        </Link>
    );
};

export default CreateEventLink;
