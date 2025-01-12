import { getProjects } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Eye, MoveRight } from "lucide-react";
import Link from "next/link";
import DeleteProject from "./deleteProject";

interface IProjectList {
    orgId: string;
}

const ProjectList = async ({ orgId }: IProjectList) => {
    const projects = await getProjects(orgId);

    if (projects.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-neutral-700 text-sm">
                    No project found.{" "}
                    <Link
                        href="/project/create/"
                        className="text-blue-500 hover:underline underline-offset-2"
                    >
                        Create New
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {projects.map((project) => (
                <Card key={project.id} className="border-neutral-200">
                    <CardContent className="p-4 space-y-3">
                        <h2 className="text-lg font-semibold line-clamp-1">
                            {project.name}
                        </h2>
                        <p className="text-neutral-700 text-sm line-clamp-3">
                            {project.description}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            <Link
                                href={`/project/${project.id}/`}
                                className="p-2 border border-neutral-300 rounded-md hover:bg-neutral-200"
                            >
                                <ExternalLink size={18} />
                            </Link>
                            <DeleteProject projectId={project.id} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ProjectList;
