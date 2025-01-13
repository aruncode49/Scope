"use server";

import { IIssue, TIssuePriority, TIssueStatus } from "@/lib/interfaces";
import { db } from "@/lib/prisma";
import { TIssueFormData } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";

interface ICreateIssueData extends TIssueFormData {
    sprintId: string;
    status: TIssueStatus;
}

interface IUpdateIssueData {
    priority: TIssuePriority;
    status: TIssueStatus;
}

export const createIssue = async (
    projectId: string,
    data: ICreateIssueData
) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

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
            reporterId: user?.id ?? "", // who is creating that issue
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

export const getIssuesBySprintId = async (sprintId: string) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const issues = await db.issue.findMany({
        where: { sprintId },
        orderBy: [{ status: "asc" }, { order: "asc" }],
        include: {
            assignee: true,
            reporter: true,
        },
    });

    return issues as IIssue[];
};

export const updateIssueOrder = async (updatedIssueList: IIssue[]) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    // used transactions to handle multiple api call at a single time
    // Transactions: Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
    await db.$transaction(async (prisma) => {
        await Promise.all(
            updatedIssueList.map((issue) =>
                prisma.issue.update({
                    where: {
                        id: issue.id,
                    },
                    data: {
                        status: issue.status,
                        order: issue.order,
                    },
                })
            )
        );
    });
};

export async function deleteIssue(issueId: string) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const issue = await db.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
    });

    if (!issue) {
        throw new Error("Issue not found");
    }

    if (
        issue.reporterId !== user.id &&
        issue.project.organizationId !== orgId
    ) {
        throw new Error("You don't have permission to delete this issue");
    }

    await db.issue.delete({ where: { id: issueId } });
}

export async function updateIssue(issueId: string, data: IUpdateIssueData) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const issue = await db.issue.findUnique({
            where: { id: issueId },
            include: { project: true },
        });

        if (!issue) {
            throw new Error("Issue not found");
        }

        if (issue.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
        }

        const updatedIssue = await db.issue.update({
            where: { id: issueId },
            data: {
                status: data.status,
                priority: data.priority,
            },
            include: {
                assignee: true,
                reporter: true,
            },
        });

        return updatedIssue;
    } catch (error) {
        throw new Error(
            "Error while updating issue: " +
                (error instanceof Error && error.message)
        );
    }
}

export async function getUserIssues(userId: string) {
    const { orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("No user id or organization id found");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const issues = await db.issue.findMany({
        where: {
            OR: [{ assigneeId: user.id }, { reporterId: user.id }],
            project: {
                organizationId: orgId,
            },
        },
        include: {
            project: true,
            assignee: true,
            reporter: true,
        },
        orderBy: { updatedAt: "desc" },
    });

    return issues;
}
