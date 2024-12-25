import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/custom/orgSwitcher";
import Image from "next/image";

type TParams = { orgId: string };

const OrganizationPage = async ({ params }: { params: TParams }) => {
    const { orgId } = await params;
    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization Not Found!</div>;
    }

    return (
        <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-lg flex items-center gap-2">
                    <Image
                        src={organization.imageUrl}
                        alt="organization"
                        width={50}
                        height={50}
                        className="h-5 w-5 object-cover rounded"
                    />
                    {organization.name} Projects
                </h1>
                <OrgSwitcher />
            </div>

            {/* Org Projects */}
            <h1>Org Projects</h1>

            {/* Assigned and Reported issues */}
            <h1>Assigned Issues</h1>
        </div>
    );
};

export default OrganizationPage;
