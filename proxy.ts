import { NextResponse } from "next/server";

import { auth } from "@/auth";

// Runs before the page. Signed-out visitors go to sign-in, then come back to the page they asked for.
export default auth((req) => {
    if (req.auth) return NextResponse.next();

    const { pathname, search } = req.nextUrl;
    const signIn = new URL("/auth/sign-in", req.url);
    if (pathname === "/events/create") signIn.searchParams.set("reason", "create");
    signIn.searchParams.set("next", `${pathname}${search}`);

    return NextResponse.redirect(signIn);
});

export const config = {
    matcher: ["/events/create", "/my-events"],
};
