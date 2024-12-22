import { getOrganization } from "@/actions/organization";

type TParams = { orgId: string };

const OrganizationPage = async ({ params }: { params: TParams }) => {
    const { orgId } = params;
    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization Not Found!</div>;
    }

    return <div>{organization.name}'s Projects</div>;
};

export default OrganizationPage;
