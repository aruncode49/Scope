"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface IProjectData {
    key: string;
    name: string;
    description?: string;
}

export const createProject = async (data: IProjectData) => {
    const { userId, orgId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if (!orgId) {
        throw new Error("No Organization Selected");
    }

    // check if the user is an admin of that organization
    const userMembership = (await clerkClient()).organizations
        .getOrganizationMembershipList({
            organizationId: orgId,
        })
        .then((memberShip) => {
            return memberShip.data.find(
                (member) => member.publicUserData?.userId === userId
            );
        });

    const memberShip = await userMembership;

    if (!memberShip || memberShip.role !== "org:admin") {
        throw new Error("Only organization admins can create projects");
    }

    try {
        const project = await db.project.create({
            data: {
                key: data.key,
                name: data.name,
                description: data.description,
                organizationId: orgId,
            },
        });

        return project;
    } catch (error) {
        throw new Error(
            "Error while creating project: " +
                (error instanceof Error && error.message)
        );
    }
};

export const getProjects = async (orgId: string) => {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found!");
    }

    const projects = await db.project.findMany({
        where: {
            organizationId: orgId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return projects;
};

export const deleteProject = async (projectId: string) => {
    const { userId, orgId, orgRole } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
        throw new Error("Only organization admin can delete projects");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project || project.organizationId !== orgId) {
        throw new Error(
            "Project not found or you don't have permission to delete it."
        );
    }

    await db.project.delete({
        where: {
            id: projectId,
        },
    });

    return { success: true };
};

export const getProject = async (projectId: string) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found!");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            sprints: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!project) {
        throw new Error("Project not found!");
    }

    // verifying that the project belonging to the organization or not
    if (project.organizationId !== orgId) {
        return null;
    }

    return project;
};
