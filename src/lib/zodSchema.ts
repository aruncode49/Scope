import { z } from "zod";

export const projectSchema = z.object({
    name: z
        .string()
        .min(1, "Project name is required!")
        .max(100, "Project name must not exceed 100 characters!"),
    key: z
        .string()
        .min(2, "Project key must be at least 2 characters!")
        .max(10, "Project key must not exceed 10 characters!"),
    description: z
        .string()
        .max(500, "Description must not exceed 500 characters!")
        .optional(),
});

export const sprintSchema = z.object({
    name: z.string().min(1, "Sprint name is required"),
    startDate: z.date(),
    endDate: z.date(),
});

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required"),
    assigneeId: z.string().cuid("Please select assignee"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export type TProjectFormData = z.infer<typeof projectSchema>;
export type TSprintFormData = z.infer<typeof sprintSchema>;
export type TIssueFormData = z.infer<typeof issueSchema>;
