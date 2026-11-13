import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Signs out without letting Auth.js pick the redirect URL, which can be an address the browser can't open.
export function useSignOut() {
    const router = useRouter();

    return async () => {
        try {
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };
}
