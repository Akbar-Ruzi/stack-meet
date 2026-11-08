import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthPanel from "@/components/auth/AuthPanel";

async function SignInContent() {
    const session = await auth();

    if (session?.user) {
        redirect("/");
    }

    return <AuthPanel />;
}

export default function SignInPage() {
    return (
        <div
            data-full-width
            className="flex flex-1 items-center justify-center px-6 pb-24 pt-18"
        >
            <Suspense fallback={null}>
                <SignInContent />
            </Suspense>
        </div>
    );
}
