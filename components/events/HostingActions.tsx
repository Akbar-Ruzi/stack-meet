import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

type HostingActionsProps = {
    slug: string;
    canEdit: boolean; // false for a past event, which can't be edited
};

// Shown on the booking card instead of the form when the organizer views their own event.
const HostingActions = ({ slug, canEdit }: HostingActionsProps) => (
    <div className="mt-5.5 flex flex-col gap-2.5">
        {canEdit && (
            <Link href={`/events/${slug}/edit`} className={buttonClasses({ className: "w-full gap-2" })}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
                Edit event
            </Link>
        )}
        <Link
            href="/my-events"
            className="flex min-h-12 w-full items-center justify-center rounded-[10px] border border-border text-[15px] font-bold text-text"
        >
            Go to My events
        </Link>
    </div>
);

export default HostingActions;
