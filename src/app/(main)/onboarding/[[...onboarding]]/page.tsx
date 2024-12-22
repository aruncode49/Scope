"use client";

import { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { OrganizationList } from "@clerk/nextjs";

const OnboardingPage = () => {
    // hooks
    const { organization } = useOrganization();
    const router = useRouter();

    // effect
    useEffect(() => {
        if (organization) {
            router.push(`/organization/${organization.slug}/`);
        }
    }, [organization]);

    return (
        <div className="dotted-background flex items-center justify-center py-10">
            <OrganizationList
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug/"
                afterSelectOrganizationUrl="/organization/:slug/"
            />
        </div>
    );
};

export default OnboardingPage;
