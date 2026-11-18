// The event's meeting link, shown next to "Online" only to people who booked and to the organizer.
const JoinOnlineLink = ({ href }: { href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-8 items-center gap-1.5 font-bold text-accent underline underline-offset-3"
    >
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="13" height="12" rx="2" />
            <path d="M16 10l5-3v10l-5-3" />
        </svg>
        Join online →
    </a>
);

export default JoinOnlineLink;
