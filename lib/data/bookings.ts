import "server-only";

import connectDB from "@/lib/data/mongodb";
import Booking from "@/database/booking.model";

// Bookings hidden with hiddenByUser still count, because those spots were still booked.
export async function getBookingCount(eventId: string): Promise<number> {
    await connectDB();
    return Booking.countDocuments({ eventId });
}
