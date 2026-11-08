import { redirect } from "next/navigation";

// Creating an account is a tab on the sign-in page.
export default function SignUpPage() {
    redirect("/auth/sign-in?tab=create");
}
