export type TSprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

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
