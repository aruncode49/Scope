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

export type TProjectFormData = z.infer<typeof projectSchema>;
export type TSprintFormData = z.infer<typeof sprintSchema>;
