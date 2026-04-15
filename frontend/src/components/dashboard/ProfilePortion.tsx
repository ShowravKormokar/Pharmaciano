"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./logout-button";

interface ProfilePortionProps {
    name?: string;
    email?: string;
    roleId?: string;
    image?: string;
    authReady: boolean;
}

const ProfilePortion = ({
    name,
    email,
    roleId = "User",
    image,
    authReady,
}: ProfilePortionProps) => {
    const router = useRouter();

    const displayName = authReady
        ? name || email || "User"
        : "—";

    const fallbackText =
        displayName !== "—"
            ? displayName.charAt(0).toUpperCase()
            : "U";

    return (
        <div className="border-t px-3 py-2">
            <div
                onClick={() => router.push("/dashboard/user-profile")}
                className="flex items-center justify-between gap-2 rounded-lg p-2 cursor-pointer hover:bg-muted transition"
                title="View Profile"
            >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-9 w-9 border-primary/10 border-2">
                        {/* <AvatarImage src={image} alt={displayName} /> */}
                        <AvatarFallback className="text-primary">{fallbackText}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight overflow-hidden">
                        {/* <span className="text-[11px] text-muted-foreground truncate"> */}

                        <span className="max-w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[8px] lg:text-[10px] font-semibold text-primary truncate">
                            {roleId}
                        </span>
                        <span className="text-xs font-semibold truncate capitalize">
                            {displayName}
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                >
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default ProfilePortion;