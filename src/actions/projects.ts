"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface IProjectData {
    key: string;
    name: string;
    description: string;
}

export const createProject = async (data: IProjectData) => {
    const { userId, orgId } = await auth();

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
