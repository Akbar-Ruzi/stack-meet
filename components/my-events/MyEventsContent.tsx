import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MyEventsTabs from "@/components/my-events/MyEventsTabs";
import HostingList from "@/components/my-events/HostingList";
import BookedList from "@/components/my-events/BookedList";
import { countEventsByUser } from "@/lib/data/events";
import { countUpcomingBookingsByUser } from "@/lib/data/bookings";
import { getHostedEvents, getUpcomingBookings } from "@/lib/data/my-events";
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

    // Only the open tab's list is loaded.
    const [hostingCount, bookedCount, hostedEvents, bookings] = await Promise.all([
        orNull(countEventsByUser(userId)),
        orNull(countUpcomingBookingsByUser(userId)),
        tab === "hosting" ? getHostedEvents(userId) : null,
        tab === "booked" ? getUpcomingBookings(userId) : null,
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
            <div role="tabpanel" id={`my-events-panel-${tab}`} aria-labelledby={`my-events-tab-${tab}`}>
                {hostedEvents && <HostingList events={hostedEvents} />}
                {bookings && <BookedList bookings={bookings} />}
            </div>
        </>
    );
};

export default MyEventsContent;
