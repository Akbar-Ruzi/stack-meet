"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";

export type AccountUser = {
    name: string | null;
    email: string | null;
};

const getInitials = ({ name, email }: AccountUser) => {
    const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return (words[0] ?? email ?? "?").slice(0, 2).toUpperCase();
};

const ITEM_CLASSES = "flex min-h-11 w-full cursor-pointer items-center rounded-md px-3 text-left text-[15px]";

const AccountMenu = ({ user }: { user: AccountUser }) => {
    const { isOpen, toggle, close, containerRef, buttonRef, menuRef } = useDropdownMenu();

    return (
        <span ref={containerRef} className="relative ml-2">
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                onClick={toggle}
                className="size-11 cursor-pointer rounded-full border border-border bg-[#1C211E] font-mono text-[14px] font-medium text-accent"
            >
                {getInitials(user)}
            </button>
            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-13 z-20 w-60 rounded-[12px] border border-border bg-surface p-2 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                >
                    <div className="mb-1.5 border-b border-line px-3 pb-3 pt-2.5">
                        <div className="wrap-break-word font-bold">{user.name}</div>
                        <div className="wrap-break-word text-[13px] text-muted">{user.email}</div>
                    </div>
                    <Link role="menuitem" href="/my-events?tab=hosting" onClick={close} className={`${ITEM_CLASSES} text-text`}>
                        Events I&apos;m hosting
                    </Link>
                    <Link role="menuitem" href="/my-events?tab=booked" onClick={close} className={`${ITEM_CLASSES} text-text`}>
                        My bookings
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`${ITEM_CLASSES} text-muted`}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </span>
    );
};

export default AccountMenu;
