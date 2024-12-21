"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
    return (
        <div className="flex items-center justify-center">
            <UserButton
                appearance={{
                    elements: {
                        avatarBox: "h-8 w-8 sm:h-9 sm:w-9",
                    },
                }}
            >
                <UserButton.MenuItems>
                    <UserButton.Link
                        href="/onboarding/"
                        label="My Organizations"
                        labelIcon={<ChartNoAxesGantt size={16} />}
                    />
                    {/* To reorder the Manage Account below the organization */}
                    <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
            </UserButton>
        </div>
    );
};

export default UserMenu;
