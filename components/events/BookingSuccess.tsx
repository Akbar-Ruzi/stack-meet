type BookingSuccessProps = {
    name: string;
    onlineUrl?: string;
};

// Replaces the booking form once a spot is reserved.
const BookingSuccess = ({ name, onlineUrl }: BookingSuccessProps) => (
    <div role="status" className="mt-6">
        <p className="font-mono text-[13px] text-accent">✓ Spot reserved</p>
        <p className="mt-2 text-[15px] text-text">You&apos;re booked, {name}. See you there.</p>

        {onlineUrl && (
            <div className="mt-4.5 border-t border-line pt-4">
                <p className="font-mono text-xs text-muted">Join online</p>
                <a href={onlineUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[15px] text-accent underline">
                    {onlineUrl}
                </a>
                <p className="mt-1.5 text-sm text-muted">Save this link. We can&apos;t email it to you.</p>
            </div>
        )}
    </div>
);

export default BookingSuccess;
