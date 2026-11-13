import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/data/mongodb";
import { Booking, Event } from "@/database";
import { today } from "@/lib/data/events";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * DELETE /api/bookings/[id]
 * Cancels a spot. Only the signed-in user the booking belongs to can cancel it, and only
 * before the event. Guest bookings have no user, so they can't be canceled here yet.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        // A malformed id would make Mongoose throw, so it's answered like any missing booking.
        if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

        await connectDB();
        const booking = await Booking.findById(id).select("userId eventId").lean<{ userId?: mongoose.Types.ObjectId; eventId: mongoose.Types.ObjectId }>();
        if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        if (booking.userId?.toString() !== userId) {
            return NextResponse.json({ message: "You can only cancel your own spot." }, { status: 403 });
        }

        // A past booking stays, so the organizer's attendance history is kept.
        const event = await Event.findById(booking.eventId).select("date").lean<{ date: string }>();
        if (event && event.date < today()) {
            return NextResponse.json({ message: "This event has already happened." }, { status: 400 });
        }

        await Booking.deleteOne({ _id: id, userId });
        return NextResponse.json({ message: "Spot cancelled" }, { status: 200 });
    } catch (error) {
        console.error("Booking cancellation failed:", error);
        return NextResponse.json({ message: "Couldn't cancel your spot. Please try again." }, { status: 500 });
    }
}
