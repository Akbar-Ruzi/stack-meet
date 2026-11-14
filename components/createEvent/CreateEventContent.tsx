import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CreateEventForm from "@/components/createEvent/CreateEventForm";

const SIGN_IN_URL = `/auth/sign-in?${new URLSearchParams({ reason: "create", next: "/events/create" })}`;

// Signed-out visitors go to sign-in and come back here after. proxy.ts does the same before
// the page loads, but this check doesn't depend on it.
const CreateEventContent = async () => {
    const session = await auth();
    if (!session?.user?.id) redirect(SIGN_IN_URL);

    return <CreateEventForm />;
};

export default CreateEventContent;
