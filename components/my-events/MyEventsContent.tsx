import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MyEventsTabs from "@/components/my-events/MyEventsTabs";
import { countEventsByUser } from "@/lib/data/events";
import { countUpcomingBookingsByUser } from "@/lib/data/bookings";
import { parseMyEventsTab, type MyEventsSearchParams } from "@/lib/url/my-events-query";

// A count that fails to load is left out, so a failure never reads as "0".
const orNull = (count: Promise<number>) =>
    count.catch((error): null => {
        console.error("Loading a My events count failed:", error);
        return null;
    });

const MyEventsContent = async ({ searchParams }: { searchParams: Promise<MyEventsSearchParams> }) => {
    const [session, params] = await Promise.all([auth(), searchParams]);
    const tab = parseMyEventsTab(params);

    // proxy.ts already sends signed-out visitors to sign-in. This covers a session that ends in between.
    const userId = session?.user?.id;
    if (!userId) redirect(`/auth/sign-in?next=${encodeURIComponent(`/my-events?tab=${tab}`)}`);

    const [hostingCount, bookedCount] = await Promise.all([
        orNull(countEventsByUser(userId)),
        orNull(countUpcomingBookingsByUser(userId)),
    ]);

    return (
        <>
            <MyEventsTabs
                selected={tab}
                tabs={[
                    { key: "hosting", label: "Hosting", count: hostingCount },
                    { key: "booked", label: "Booked", count: bookedCount },
                ]}
            />
            <div role="tabpanel" id={`my-events-panel-${tab}`} aria-labelledby={`my-events-tab-${tab}`} />
        </>
    );
};

export default MyEventsContent;
