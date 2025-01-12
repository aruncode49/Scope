import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintForm from "../_components/sprintForm";
import SprintBoard from "../_components/sprintBoard";

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
                sprintKey={
                    project.sprints?.length + Math.floor(Math.random() * 10000)
                }
            />

            {/* sprint board */}
            {project.sprints.length > 0 ? (
                <SprintBoard
                    sprints={project.sprints}
                    projectId={projectId}
                    orgId={project.organizationId}
                />
            ) : (
                <div className="text-sm text-neutral-700 text-center py-20">
                    No sprint found! Please click on add sprint to create new
                    sprint!
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
