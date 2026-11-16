// A small spinning ring in the current text color. Hidden from screen readers; the text next
// to it says what's happening. It stops spinning when the visitor asks for less motion.
const Spinner = ({ size = 18 }: { size?: number }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin motion-reduce:animate-none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

export default Spinner;
