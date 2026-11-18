import type { ReactElement } from "react";
import { notFound } from "next/navigation";

import EventHeader from "@/components/events/EventHeader";
import EventContent from "@/components/events/EventContent";
import BookForm from "@/components/events/BookForm";
import { BookingProvider } from "@/context/booking-context";
import { getEventBySlug, getOnlineUrl, today } from "@/lib/data/events";
import { getPermissionError } from "@/lib/events/permissions";
import { getBookingCount, getUserBooking } from "@/lib/data/bookings";
import { auth } from "@/auth";

// The event itself: header, cover, About, agenda, organizer and the booking card.
const EventMainContent = async ({ slug }: { slug: Promise<string> }): Promise<ReactElement> => {
    // No catch: if the query fails, the error goes to error.tsx instead of showing "not found".
    const event = await getEventBySlug(await slug);

    if (!event || !event.description || !event.image) return notFound();

    const sessionPromise = auth();
    // null means the count is unknown, so the page never claims "0 people have booked" after a failure.
    const [bookingCount, session, existingBooking] = await Promise.all([
        getBookingCount(event._id).catch((error): number | null => {
            console.error("Loading the booking count failed:", error);
            return null;
        }),
        sessionPromise,
        // If this lookup fails, the form shows and the server still turns down a second booking.
        sessionPromise.then((s) => (s?.user?.id ? getUserBooking(s.user.id, event._id) : null)).catch((error): null => {
            console.error("Loading the visitor's booking failed:", error);
            return null;
        }),
    ]);
    const account = session?.user?.email
        ? { name: session.user.name ?? "", email: session.user.email }
        : null;
    // The organizer sees the hosting card instead of the booking form. Edit event shows only while they can still edit it.
    const userId = session?.user?.id;
    const isOrganizer = Boolean(userId) && event.createdBy === userId;
    const hosting = isOrganizer
        ? {
              canEdit: getPermissionError({ event, user: { id: userId }, action: "edit", today: today() }) === null,
              // Loaded only for the organizer, so the meeting link never reaches anyone who hasn't booked.
              onlineUrl: await getOnlineUrl(event._id).catch((error): undefined => {
                  console.error("Loading the meeting link failed:", error);
                  return undefined;
              }),
          }
        : null;

    return (
        <>
            <EventHeader {...event} />
            <div className="mx-auto max-w-300 px-6">
                <div className="details">
                    <EventContent event={event} />
                    <BookingProvider value={{ eventId: event._id, slug: event.slug }}>
                        <BookForm event={event} bookingCount={bookingCount} account={account} existingBooking={existingBooking} hosting={hosting} />
                    </BookingProvider>
                </div>
            </div>
        </>
    );
};

export default EventMainContent;
