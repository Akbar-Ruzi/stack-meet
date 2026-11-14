import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import EditEventForm from "@/components/editEvent/EditEventForm";
import { getEditableEvent } from "@/lib/data/events";
import { toEventFormValues } from "@/lib/events/form";

// Only the owner of an upcoming event gets past this. Anyone else sees the 404 page.
const EditEventContent = async ({ slug }: { slug: Promise<string> }) => {
    const [session, eventSlug] = await Promise.all([auth(), slug]);

    // proxy.ts already sends signed-out visitors to sign-in. This covers a session that ends in between.
    const user = session?.user;
    if (!user?.id) redirect(`/auth/sign-in?next=${encodeURIComponent(`/events/${eventSlug}/edit`)}`);

    const event = await getEditableEvent(eventSlug, user);
    if (!event) notFound();

    return (
        <>
            <section className="mx-auto max-w-312 px-6 pt-14">
                <p className="font-mono text-[14px] text-accent">$ stackmeet edit {event.slug}</p>
                <h1 className="mt-3.5 bg-none text-[clamp(40px,5.5vw,64px)] font-bold leading-[1.02] tracking-[-0.03em] text-text">
                    Edit event
                </h1>
                <p className="mt-3.5 max-w-140 text-lg leading-normal text-muted">
                    Jump to any step and save when you&apos;re done. Fields marked <span className="text-accent">*</span> are required.
                </p>
            </section>

            <EditEventForm defaultValues={toEventFormValues(event)} savedEvent={{ slug: event.slug, image: event.image }} />
        </>
    );
};

export default EditEventContent;
