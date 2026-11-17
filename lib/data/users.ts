import "server-only";

import connectDB from "@/lib/data/mongodb";
import User from "@/database/user.model";

export type BookingContact = { name: string; email: string; phone?: string };

// The details a signed-in user's booking is saved with, read from their account rather than the request.
// null when the account no longer exists.
export async function getBookingContact(userId: string): Promise<BookingContact | null> {
    await connectDB();
    const user = await User.findById(userId).select("name email phone").lean<BookingContact>();
    if (!user) return null;
    return { name: user.name, email: user.email, phone: user.phone || undefined };
}
