"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// need to change the type of data
export const createIssue = async (projectId: string, data: any) => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const lastIssue = await db.issue.findFirst({
        where: { projectId: projectId, status: data.status },
        orderBy: { order: "desc" },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId: projectId,
            sprintId: data.sprintId,
            reporterId: userId, // who is creating that issue
            assigneeId: data.assigneeId || null,
            order: newOrder,
        },
        include: {
            assignee: true,
            reporter: true,
        },
    });

    return issue;
};
