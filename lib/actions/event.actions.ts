'use server';
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { EventFields } from "@/database";

interface getSimilarEventsBySlugParams {
    slug: string;
}
export const getSimilarEventsBySlug = async({slug}: getSimilarEventsBySlugParams) => {
    try {
        await connectDB();
        const event = await Event.findOne({slug});      
        return await Event.find({
            _id:{$ne: event?._id},
            tags: {$in: event?.tags}
        }).lean<EventFields[]>(); // <- plain JS objects typed as EventFields[]
    } catch {
        return[];
    }
}