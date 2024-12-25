"use client";

import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const OrgSwitcher = () => {
    const pathName = usePathname();

    return (
        <SignedIn>
            <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug/"
                afterSelectOrganizationUrl="/organization/:slug/"
                appearance={{
                    elements: {
                        organizationSwitcherTrigger: "pl-0 py-2 bg-neutral-900",
                        organizationPreviewAvatarBox: "hidden",
                    },
                }}
            />
        </SignedIn>
    );
};

export default OrgSwitcher;
