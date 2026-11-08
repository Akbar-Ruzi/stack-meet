import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthPanel from "@/components/auth/AuthPanel";
import { parseAuthMode, type AuthSearchParams } from "@/lib/auth-query";

type SignInPageProps = {
    searchParams: Promise<AuthSearchParams>;
};

async function SignInContent({ searchParams }: SignInPageProps) {
    const session = await auth();

    if (session?.user) {
        redirect("/");
    }

    const initialMode = parseAuthMode(await searchParams);

    // The key resets the selected tab when the URL asks for a different one.
    return <AuthPanel key={initialMode} initialMode={initialMode} />;
}

export default function SignInPage({ searchParams }: SignInPageProps) {
    return (
        <div
            data-full-width
            className="flex flex-1 items-center justify-center px-6 pb-24 pt-18"
        >
            <Suspense fallback={null}>
                <SignInContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
