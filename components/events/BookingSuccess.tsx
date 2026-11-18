"use client";

import Link from "next/link";
import JoinOnlineLink from "@/components/events/JoinOnlineLink";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";

export type BookedEventDetails = {
    title: string;
    date: string; // "Saturday, November 14, 2026"
    time: string;
    venuePlace: string | null; // the venue and city, or null for an online event
    online: boolean; // online and hybrid events add an "Online" line
};

type BookingSuccessProps = {
    event: BookedEventDetails;
    name: string;
    email: string;
    onlineUrl?: string;
    moveFocus?: boolean; // true right after booking, so the box is announced and focused
};

// The "You're in!" box, which replaces the booking card's content once the visitor has a spot.
const BookingSuccess = ({ event, name, email, onlineUrl, moveFocus = true }: BookingSuccessProps) => {
    const ref = useFocusOnMount<HTMLDivElement>(moveFocus);

    return (
        <div
            ref={ref}
            role="status"
            tabIndex={-1}
            className="rounded-[14px] border border-accent bg-accent/6 p-5.5 outline-none"
        >
            <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-full bg-accent text-on-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </span>
                <div className="min-w-0">
                    <h3 className="text-2xl">You&rsquo;re in!</h3>
                    <p className="mt-0.5 text-[15px] text-body">Your spot is reserved.</p>
                </div>
            </div>

            <p className="mt-4 text-[17px] font-bold">{event.title}</p>
            <p className="mt-1.5 text-[15px] leading-normal text-muted">
                {event.date}
                <br />
                {event.time}
            </p>

            {/* Each label sits above its value, as the design shows it. */}
            <dl className="mt-4.5 border-t border-line pt-4 text-sm">
                <dt className="font-mono text-xs text-muted">booked as</dt>
                <dd className="mt-1 min-w-0 wrap-anywhere">
                    {name}
                    <span className="block text-muted">{email}</span>
                </dd>
                <dt className="mt-3.5 font-mono text-xs text-muted">where</dt>
                <dd className="mt-1 min-w-0 wrap-anywhere">
                    {event.venuePlace && <span className="block">{event.venuePlace}</span>}
                    {event.online && (
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            Online
                            {onlineUrl && <JoinOnlineLink href={onlineUrl} />}
                        </span>
                    )}
                </dd>
            </dl>

            <Link
                href="/my-events?tab=booked"
                className="mt-4 flex min-h-12 w-full items-center justify-center rounded-[10px] border border-border text-[15px] font-bold text-text"
            >
                View my bookings
            </Link>
        </div>
    );
};

export default BookingSuccess;
