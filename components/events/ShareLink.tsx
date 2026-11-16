"use client";

import { FieldError } from "@/components/ui/Input";
import { useCopyPageLink } from "@/hooks/useCopyPageLink";

const ShareLink = () => {
    const { copyPageLink, error } = useCopyPageLink();

    return (
        <div className="flex flex-col items-start">
            <button type="button" onClick={copyPageLink} className="cursor-pointer py-2 text-accent underline">
                share
            </button>
            {/* Always rendered, so screen readers announce the message when it appears. */}
            <div role="alert" className="font-sans">
                {error && <div className="mt-1"><FieldError message={error} /></div>}
            </div>
        </div>
    );
};

export default ShareLink;
