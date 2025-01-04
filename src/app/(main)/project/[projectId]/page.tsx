import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintForm from "../_components/sprintForm";

type TParams = { projectId: string };

const ProjectPage = async ({ params }: { params: TParams }) => {
    const { projectId } = await params;

    const project = await getProject(projectId);

    if (!project) {
        notFound(); // trigger not found page
    }

    return (
        <div className="mt-5">
            {/* sprint creation form */}
            <SprintForm
                projectTitle={project.name}
                projectId={project.id}
                projectKey={project.key}
                sprintKey={project.sprints?.length + 1}
            />

            {/* sprint board */}
            {project.sprints.length > 0 ? <></> : <div>Create Sprint</div>}
        </div>
    );
};

export default ProjectPage;
