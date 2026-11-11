"use client";

import Link from "next/link";
import Button, { buttonClasses } from "@/components/ui/Button";
import { useErrorRetry } from "@/hooks/useErrorRetry";

type EventErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

// Shown when loading the event throws, for example when the database is down.
export default function EventError({ reset }: EventErrorProps) {
    const { retry, isRetrying } = useErrorRetry(reset);

    return (
        <div data-full-width className="flex flex-1 items-center justify-center px-6 pb-24 pt-18">
            <div className="flex max-w-120 flex-col items-center text-center">
                <p className="font-mono text-[14px] text-accent">{"// error"}</p>
                <h1 className="mt-5 bg-none text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-text">
                    Couldn&apos;t load this event.
                </h1>
                <p className="mt-3 text-base leading-normal text-muted">
                    Something went wrong on our side. Try again in a moment.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button onClick={retry} disabled={isRetrying}>
                        {isRetrying ? "Trying again..." : "Try again"}
                    </Button>
                    <Link href="/" className={buttonClasses({ variant: "secondary" })}>
                        ← Back to events
                    </Link>
                </div>
            </div>
        </div>
    );
}
