import { getInitials } from "@/lib/events/preview";
import type { BookingAccountUser } from "@/hooks/useBookingForm";

// Shown in place of the name, email and phone fields when the visitor is signed in.
const BookingAccount = ({ name, email }: BookingAccountUser) => (
    <div className="flex items-center gap-3 rounded-[12px] border border-line bg-field px-3.5 py-3">
        <span
            aria-hidden="true"
            className="flex size-10 flex-none items-center justify-center rounded-full border border-border bg-[#1C211E] font-mono text-[14px] font-medium text-accent"
        >
            {getInitials(name) || email.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
            <div className="font-mono text-xs text-muted">booking as</div>
            <div className="mt-0.5 text-[15px] font-medium">{name}</div>
            <div className="text-sm text-muted wrap-anywhere">{email}</div>
        </div>
    </div>
);

export default BookingAccount;
