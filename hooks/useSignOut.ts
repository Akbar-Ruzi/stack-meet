import { useState } from "react";
import { signOut as authSignOut } from "next-auth/react";
import { toastAfterPageLoad } from "@/lib/toast";

// Signs out without letting Auth.js pick the redirect URL, which can be an address the browser
// can't open. Then a full page load to Home, not router.push: the router may still hold pages
// rendered while signed in. The toast is kept for after that load.
export function useSignOut() {
    const [isSigningOut, setIsSigningOut] = useState(false);

    const signOut = async () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try {
            await authSignOut({ redirect: false });
            toastAfterPageLoad("You're signed out.");
            // A full page load on purpose: router.push could reuse pages cached while signed in.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/");
        } catch (error) {
            console.error("Sign out failed:", error);
            setIsSigningOut(false);
        }
    };

    return { signOut, isSigningOut };
}
