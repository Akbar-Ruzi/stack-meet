"use client";

import { useCopyPageLink } from "@/hooks/useCopyPageLink";

const ShareLink = () => {
    const copyPageLink = useCopyPageLink();

    return (
        <button type="button" onClick={copyPageLink} className="cursor-pointer py-2 text-accent underline">
            share
        </button>
    );
};

export default ShareLink;
