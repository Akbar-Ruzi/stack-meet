import Skeleton from "@/components/ui/Skeleton";
import SkeletonGroup from "@/components/ui/SkeletonGroup";

// One label and input, in AuthField's layout.
const FieldSkeleton = ({ labelWidth }: { labelWidth: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex h-4 items-center">
            <Skeleton className={`h-3 ${labelWidth}`} />
        </div>
        <Skeleton shape="field" className="h-12.5 w-full" />
    </div>
);

// Shown in place of the sign-in panel while it loads, in AuthPanel's Sign in layout: prompt,
// heading, two-line subtitle, the tabs, email and password, the button and the switch line.
// The page centers the panel, so the skeleton has the same height to keep it in place.
// Each bar sits in a box of the real line's height.
const AuthPanelSkeleton = () => (
    <SkeletonGroup label="Loading sign in…" className="w-full max-w-110">
        <div className="flex h-4.5 items-center">
            <Skeleton className="h-3.5 w-36" />
        </div>
        <div className="mt-3 flex h-11.5 items-center">
            <Skeleton shape="field" className="h-10 w-[70%]" />
        </div>
        <div className="mt-3 flex h-12.75 flex-col justify-around">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[55%]" />
        </div>

        <div className="mt-8">
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-field p-1">
                <Skeleton className="h-11" />
                <Skeleton className="h-11" />
            </div>

            <div className="mt-6 flex flex-col gap-4.5">
                <FieldSkeleton labelWidth="w-10" />
                <FieldSkeleton labelWidth="w-16" />
                <Skeleton shape="field" className="mt-1.5 h-13 w-full" />
            </div>

            <div className="mt-6 flex h-9.75 items-center justify-center">
                <Skeleton className="h-3.5 w-52" />
            </div>
        </div>
    </SkeletonGroup>
);

export default AuthPanelSkeleton;
