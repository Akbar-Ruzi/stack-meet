import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CreateEventForm from "@/components/createEvent/CreateEventForm";
import { SIGN_IN_TO_CREATE_URL } from "@/lib/constants";

// Signed-out visitors go to sign-in and come back here after. proxy.ts does the same before
// the page loads, but this check doesn't depend on it.
const CreateEventContent = async () => {
    const session = await auth();
    if (!session?.user?.id) redirect(SIGN_IN_TO_CREATE_URL);

    return <CreateEventForm />;
};

export default CreateEventContent;
