import Link from "next/link";

type EmptyListStateProps = { message: string; href: string; linkLabel: string };

// Shown in place of a My events list that has nothing in it.
const EmptyListState = ({ message, href, linkLabel }: EmptyListStateProps) => (
    <div className="rounded-2xl border border-dashed border-[#2F3631] px-6 py-10 text-center">
        <p className="text-[17px]">{message}</p>
        <Link href={href} className="mt-4 inline-flex min-h-11 items-center rounded-[10px] bg-accent px-4.5 font-bold text-on-accent">
            {linkLabel}
        </Link>
    </div>
);

export default EmptyListState;
