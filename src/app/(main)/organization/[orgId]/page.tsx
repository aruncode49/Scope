import React from "react";

type TParams = { orgId: string };

const OrganizationPage = ({ params }: { params: TParams }) => {
    const { orgId } = params;
    return <div>{orgId}</div>;
};

export default OrganizationPage;
