import { useEffect, useRef, useState } from "react";

// Opens and closes a dropdown menu. While it's open: focus moves to the first item, the arrow
// keys move between items, Escape closes it and a click outside closes it.
export function useDropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const items = () => [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
        items()[0]?.focus();

        const handlePointerDown = (e: PointerEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const all = items();
                const step = e.key === "ArrowDown" ? 1 : -1;
                const current = all.indexOf(document.activeElement as HTMLElement);
                all[(current + step + all.length) % all.length]?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return {
        isOpen,
        toggle: () => setIsOpen((open) => !open),
        close: () => setIsOpen(false),
        containerRef,
        buttonRef,
        menuRef,
    };
}
