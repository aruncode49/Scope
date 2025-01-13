import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/custom/orgSwitcher";
import ProjectList from "@/app/(main)/project/_components/projectList";
import Image from "next/image";
import UserIssues from "../_components/userIssues";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type TParams = { orgId: string };

const OrganizationPage = async ({ params }: { params: Promise<TParams> }) => {
    const resolvedParams = await params;
    const { orgId } = resolvedParams;

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const organization = await getOrganization(orgId);
    if (!organization) {
        return (
            <div className="text-center text-neutral-700 text-sm py-20">
                Organization Not Found!
            </div>
        );
    }

    return (
        <div className="mt-5 h-full">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-xl flex items-center gap-2">
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
            <ProjectList orgId={organization.id} />

            {/* User Assigned and Reported issues */}
            <UserIssues userId={userId} />
        </div>
    );
};

export default OrganizationPage;
