import "server-only";

import connectDB from "@/lib/data/mongodb";
import User from "@/database/user.model";
import { MAX_EVENTS_PER_USER } from "@/lib/constants";

// A user's eventCount says how many events they've created. Checking and raising it in one
// database update means parallel requests can't all pass the limit at once.

// Takes one of the user's event slots. Returns false when they've reached the limit.
// Exempt users (admins) aren't limited, but their count is still kept up to date.
export async function claimEventSlot(userId: string, { exempt }: { exempt: boolean }): Promise<boolean> {
    await connectDB();

    const filter = exempt ? { _id: userId } : { _id: userId, eventCount: { $lt: MAX_EVENTS_PER_USER } };
    const result = await User.updateOne(filter, { $inc: { eventCount: 1 } });
    return result.modifiedCount === 1;
}

// Gives a slot back, after a failed create or when an event is deleted.
export async function releaseEventSlot(userId: string): Promise<void> {
    await connectDB();
    await User.updateOne({ _id: userId, eventCount: { $gt: 0 } }, { $inc: { eventCount: -1 } });
}
