"use server";

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
