import { NextResponse } from "next/server";

import { auth } from "@/auth";

// Runs before the page. Signed-out visitors go to sign-in, then come back to the form.
export default auth((req) => {
    if (req.auth) return NextResponse.next();

    return NextResponse.redirect(new URL("/auth/sign-in?reason=create&next=/events/create", req.url));
});

export const config = {
    matcher: ["/events/create"],
};
