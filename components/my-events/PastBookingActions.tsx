"use client";

import Link from "next/link";
import { FieldError } from "@/components/ui/Input";
import { useRemovePastBooking } from "@/hooks/useRemovePastBooking";
import { ACTIONS_ROW } from "@/lib/constants";

type PastBookingActionsProps = { bookingId: string; title: string; slug: string };

// View event and Remove on a past booking. While Remove runs, the button is locked and faded;
// if it fails, the message shows under the buttons and the row stays.
const PastBookingActions = ({ bookingId, title, slug }: PastBookingActionsProps) => {
    const { isPending, error, remove } = useRemovePastBooking({ bookingId, title });

    return (
        <div className="max-[640px]:flex-[1_1_100%]">
            <div className={ACTIONS_ROW}>
                <Link href={`/events/${slug}`} className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-3.5 text-sm text-body">
                    View event
                </Link>
                <button
                    type="button"
                    onClick={remove}
                    aria-disabled={isPending}
                    aria-label={`Remove ${title} from my list`}
                    className={`inline-flex min-h-11 items-center rounded-[10px] border border-border px-3.5 text-sm font-medium text-muted ${isPending ? "cursor-wait opacity-75" : "cursor-pointer"}`}
                >
                    Remove
                </button>
            </div>
            {/* Kept in the page while empty, so screen readers announce the message when it appears. */}
            <div role="alert">
                {error && <div className="mt-2.5"><FieldError message={error} /></div>}
            </div>
        </div>
    );
};

export default PastBookingActions;
