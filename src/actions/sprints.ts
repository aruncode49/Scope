"use server";

import { TSprintStatus } from "@/lib/interfaces";
import { db } from "@/lib/prisma";
import { TSprintFormData } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";

export const createSprint = async (
    projectId: string,
    data: TSprintFormData
) => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found");
    }

    const sprint = await db.sprint.create({
        data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            projectId: projectId,
            status: "PLANNED",
        },
    });

    return sprint;
};

export const updateSprintStatus = async (
    sprintId: string,
    status: TSprintStatus
) => {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: {
                id: sprintId,
            },
            include: {
                project: true,
            },
        });

        if (!sprint) {
            throw new Error("Sprint not found!");
        }

        if (sprint.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
        }

        if (orgRole !== "org:admin") {
            throw new Error("Only admin can make this chagne");
        }

        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const today = new Date();

        if (status === "ACTIVE" && (today < startDate || today > endDate)) {
            throw new Error("Cannot start sprint outside of its date range.");
        }

        if (status === "COMPLETED" && sprint.status !== "ACTIVE") {
            throw new Error("You can only complete an active sprint.");
        }

        const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: status },
        });

        return { sprint: updatedSprint, success: true };
    } catch (error) {
        throw new Error(
            "Error while updating sprint status: " +
                (error instanceof Error && error.message)
        );
    }
};
