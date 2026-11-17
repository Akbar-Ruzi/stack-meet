// The corner radius for each kind of block, as the design gives them.
const SHAPES = {
    block: "rounded-[6px]",
    pill: "rounded-full",
    tile: "rounded-[12px]",
    cover: "rounded-2xl",
};

type SkeletonProps = {
    shape?: keyof typeof SHAPES;
    className?: string; // size and spacing, for example "h-5 w-40"
};

// One grey placeholder block in a loading skeleton. It pulses softly, and stays still
// when the visitor asks for less motion.
const Skeleton = ({ shape = "block", className = "" }: SkeletonProps) => (
    <span
        aria-hidden="true"
        className={`block bg-skeleton animate-skeleton-pulse motion-reduce:animate-none ${SHAPES[shape]} ${className}`}
    />
);

export default Skeleton;
