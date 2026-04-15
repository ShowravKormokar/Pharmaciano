"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="border-t px-3 py-2">
            <div className="flex items-center justify-between gap-2 p-2">

                {/* Left */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-full" />

                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>

                {/* Right (logout placeholder) */}
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
    );
};

export default ProfileSkeleton;