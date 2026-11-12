import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";

import connectDB from "@/lib/data/mongodb";
import Event from '@/database/event.model';
import { getUpcomingEvents } from "@/lib/data/events";
import { claimEventSlot, releaseEventSlot } from "@/lib/data/event-slots";
import { MAX_EVENTS_PER_USER } from "@/lib/constants";
import { checkCoverImage, deleteCoverImage, uploadCoverImage } from "@/lib/cloudinary/cover-image";

// Events the whole site can hold, past ones included.
const MAX_TOTAL_EVENTS = 100;

export async function POST(req: NextRequest) {
	let slotUserId: string | null = null; // Set once a slot is claimed, so a failure below can give it back
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json(
				{ message: "You must be signed in to create an event." },
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const userRole = session.user.role;

		await connectDB();

		const formData = await req.formData();

		// Validate & read image
		const imageValue = formData.get("image");
		if (!(imageValue instanceof File)) {
			return NextResponse.json({ message: "Image file is required" }, { status: 400 });
		}
		const imageError = await checkCoverImage(imageValue);
		if (imageError) return NextResponse.json({ message: imageError }, { status: 400 });

		// Text fields only. The image is a File, and the event stores its Cloudinary URL instead.
		const eventFields: Record<string, string> = {};
		for (const [k, v] of formData.entries()) {
			if (k !== "image" && typeof v === "string") eventFields[k] = v;
		}

		// Built and checked before anything is uploaded, so a rejected event leaves no image in Cloudinary.
		// The image URL doesn't exist yet, so that one rule is skipped until after the upload.
		const event = new Event({
			...eventFields,
			tags: JSON.parse((formData.get("tags") as string | null) ?? "[]"),
			agenda: JSON.parse((formData.get("agenda") as string | null) ?? "[]"),
			createdBy: userId,
		});
		await event.validate({ pathsToSkip: ["image"] });

		// Applies to admins too. A plain count, so parallel requests right at the limit can go
		// slightly over, which is fine for a cap on how much the database stores.
		if (await Event.countDocuments() >= MAX_TOTAL_EVENTS) {
			return NextResponse.json(
				{ message: "StackMeet isn't accepting new events right now. Please try again later." },
				{ status: 403 }
			);
		}

		// Claimed after the form checks above, so a bad request doesn't use up a slot.
		const hasSlot = await claimEventSlot(userId, { exempt: userRole === "admin" });
		if (!hasSlot) {
			return NextResponse.json(
				{ message: `You have reached the maximum limit of ${MAX_EVENTS_PER_USER} events.` },
				{ status: 403 }
			);
		}
		slotUserId = userId;

		const image = await uploadCoverImage(imageValue);
		event.set({ image });

		// Some failures only show up when saving, such as a title another event already uses,
		// so the image uploaded above is deleted if the save fails.
		try {
			await event.save();
		} catch (saveError) {
			await deleteCoverImage(image).catch((error) => console.error("Unused cover cleanup failed:", error));
			throw saveError;
		}

		return NextResponse.json(
			{ message: 'Event created successfully', event },
			{ status: 201 });
	} catch (e) {
		console.error('Event creation failed:', e);
		if (slotUserId) await releaseEventSlot(slotUserId).catch((error) => console.error("Event slot release failed:", error));
		if (e instanceof mongoose.Error.ValidationError) {
			const [firstError] = Object.values(e.errors);
			return NextResponse.json({ message: firstError.message }, { status: 400 });
		}
		const errors = e as {
			code?: number; keyPattern?: Record<string, unknown>;
		};
		if (errors?.code === 11000) {
			return NextResponse.json(
				{
					message: 'Please choose a different title.',
					code: 'DUPLICATE_EVENT_TITLE',
				},
				{ status: 409 }
			)

		}
	}
	return NextResponse.json(
		{ message: 'Event Creation Failed', error: 'Unknown' },
		{ status: 500 }
	)
}

export async function GET() {
	try {
		const events = await getUpcomingEvents();
		return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
	} catch (e) {
		console.error('Event fetching failed:', e);
		return NextResponse.json({
			message: 'Event fetching failed',
			...(process.env.NODE_ENV === "development" && {
				error: (e as Error).message,
			}),
		}, { status: 500 });
	}
}