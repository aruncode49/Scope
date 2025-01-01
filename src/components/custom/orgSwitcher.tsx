"use client";

import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";

const OrgSwitcher = () => {
    return (
        <SignedIn>
            <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug/"
                afterSelectOrganizationUrl="/organization/:slug/"
                appearance={{
                    elements: {
                        organizationSwitcherTrigger: "pl-0 py-2 bg-neutral-200",
                        organizationPreviewAvatarBox: "hidden",
                    },
                }}
            />
        </SignedIn>
    );
};

export default OrgSwitcher;
