export type TSprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export type TIssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TIssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ISprint {
    projectId: string;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    status: TSprintStatus;
}

export interface IUser {
    id: string;
    clerkUserId: string;
    email: string;
    name?: string;
    imageUrl?: string;
    createdIssues: IIssue[];
    assignedIssues: IIssue[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IIssue {
    id: string;
    title: string;
    description?: string;
    status: TIssueStatus;
    order: number;
    priority: TIssuePriority;
    assignee?: IUser;
    assigneeId?: string;
    reporter?: IUser;
    reporterId: string;
    project?: IProject;
    projectId: string;
    sprint?: ISprint;
    sprintId?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IProject {
    id: string;
    name: string;
    key: string;
    description?: string;
    organizationId: string;
    sprints: ISprint[];
    issues: IIssue[];
    createdAt: Date;
    updatedAt: Date;
}
