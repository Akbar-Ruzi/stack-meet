type ToastCardProps = {
    message: string;
    onDismiss: () => void;
};

// The toast itself: a lime check, the message and a dismiss button.
// The toaster around it is already a polite live region, so it has no role of its own.
const ToastCard = ({ message, onDismiss }: ToastCardProps) => (
    <div className="toast-card flex items-center gap-3 rounded-[12px] border border-border bg-surface py-2 pl-4 pr-2 font-sans text-[15px] font-medium text-text shadow-[0_12px_32px_rgba(0,0,0,0.55)]">
        <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-full bg-accent text-on-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
            </svg>
        </span>
        <span className="min-w-0 flex-1 leading-[1.4]">{message}</span>
        <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-lg text-muted"
        >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
            </svg>
        </button>
    </div>
);

export default ToastCard;
