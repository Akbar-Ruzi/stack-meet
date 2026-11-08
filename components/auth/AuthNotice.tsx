const AuthNotice = () => (
    <div role="status" className="mb-7 flex items-start gap-3 rounded-xl border border-accent bg-field px-4 py-3.5">
        <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 flex-none text-accent"
        >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        <div>
            <div className="text-[15px] font-bold">Sign in to create an event</div>
            <div className="mt-1 text-[14px] leading-normal text-muted">
                You need an account to host events. You&apos;ll go straight to the form after signing in.
            </div>
        </div>
    </div>
);

export default AuthNotice;
