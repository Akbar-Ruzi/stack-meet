import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/data/mongodb";
import Event, { type IEvent } from '@/database/event.model';
import { getEventBySlug } from "@/lib/data/events";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { parseEventUpdates } from "@/lib/events/edit";

// Define route params type for type safety
type RouteParams = {
  params: Promise<{
    slug: string
  }>;
};

type AuthorizedEventResult =
  | { error: NextResponse; event?: never; slug?: never }
  | { error?: never; event: IEvent; slug: string };

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * @param request - The incoming request object
 * @param params - Route parameters containing the slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    //Await the slug from params
    const { slug } = await params;

    // Validate slug parameter

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Sanitize slug ( Trim whitespace and validate slug format)

    const sanitizedSlug = slug.trim().toLowerCase();
    if (!sanitizedSlug) {
      return NextResponse.json(
        { message: 'Slug parameter cannot be empty' },
        { status: 400 }
      );
    }


    // Query for event by slug
    const event = await getEventBySlug(sanitizedSlug);

    // Check if event exists
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      {
        message: 'Event fetched successfully',
        event
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching event by slug:', error);
    }
    // Handle database connection errors
    if (error instanceof Error) {
      // Check for specific MongoDB errors if needed

      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: 'Database configuration error' },
          { status: 500 }
        );
      }

      // Return generic error with error message
      return NextResponse.json(
        { message: 'Failed to fetch event', error: error.message },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { message: 'An unexpected error occurred while fetching the event' },
      { status: 500 }
    );
  }
}

async function getAuthorizedEvent(params: Promise<{ slug: string }>): Promise<AuthorizedEventResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  await connectDB();

  const { slug } = await params;
  const normalizedSlug = slug.trim().toLowerCase();

  const event = await Event.findOne({ slug: normalizedSlug });
  if (!event) {
    return {
      error: NextResponse.json(
        { message: `Event with slug '${normalizedSlug}' not found` },
        { status: 404 }
      )
    };
  }

  const isAdmin = session.user.role === "admin";
  const isOwner = event.createdBy.toString() === session.user.id;

  if (!isAdmin && !isOwner) {
    return {
      error: NextResponse.json(
        { message: "You are not allowed to modify this event." },
        { status: 403 }
      )
    };
  }

  return {event, slug: normalizedSlug };
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const result = await getAuthorizedEvent(params);
    if ("error" in result) return result.error!;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "The request body must be valid JSON." }, { status: 400 });
    }

    const { updates, error } = parseEventUpdates(body);
    if (!updates) return NextResponse.json({ message: error }, { status: 400 });

    // Applying the changes to the loaded event and saving it runs the model's validators
    // and its save hook, which normalizes the date and time.
    const { event } = result;
    event.set(updates);
    await event.save();

    return NextResponse.json(
      { message: "Event updated successfully", event },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const message = Object.values(error.errors).map((issue) => issue.message).join(" ");
      return NextResponse.json({ message }, { status: 400 });
    }

    console.error("Event update failed:", error);
    return NextResponse.json({ message: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const result = await getAuthorizedEvent(params);
    if ("error" in result) return result.error!;

    await Event.deleteOne({ slug: result.slug });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Event deletion failed:", error);
    return NextResponse.json({ message: "Failed to delete event" }, { status: 500 });
  }
}