import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";

type TParams = { projectId: string };

const ProjectPage = async ({ params }: { params: TParams }) => {
    const { projectId } = await params;

    const project = await getProject(projectId);

    if (!project) {
        notFound(); // trigger not found page
    }

    return <div>ProjectPage</div>;
};

export default ProjectPage;
