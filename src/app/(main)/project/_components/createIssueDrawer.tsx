"use client";

import { createIssue } from "@/actions/issues";
import { getOrganizationMembers } from "@/actions/organization";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { TIssueStatus } from "@/lib/interfaces";
import { issueSchema, TIssueFormData } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ICreateIssueDrawer {
    open: boolean;
    onClose: () => void;
    sprintId: string;
    status: TIssueStatus | null;
    projectId: string;
    onIssueCreated: () => Promise<void>;
    orgId: string;
}

const CreateIssueDrawer = (props: ICreateIssueDrawer) => {
    // hooks
    const {
        loading: issueLoading,
        error,
        makeRequest: onCreateIssue,
    } = useFetch({
        cb: createIssue,
    });

    const { data: orgMembers, makeRequest: getAllOrganizationMembers } =
        useFetch({
            cb: getOrganizationMembers,
        });

    const {
        control,
        formState: { errors },
        register,
        handleSubmit,
        reset,
    } = useForm<TIssueFormData>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        },
    });

    // vars
    const _orgMembers = orgMembers || [];

    // actions
    const onSubmit = async (data: TIssueFormData) => {
        const isSuccess = await onCreateIssue(props.projectId, {
            ...data,
            status: props.status!,
            sprintId: props.sprintId,
        });

        if (isSuccess) {
            props.onClose();
            reset(); // reset all form fields
            toast.success("Issue created successfully!");
            await props.onIssueCreated();
        }
    };

    // effects
    useEffect(() => {
        if (props.open && props.orgId && _orgMembers?.length === 0) {
            getAllOrganizationMembers(props.orgId);
        }
    }, [props.open, props.orgId]);

    return (
        <Drawer open={props.open} onClose={props.onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Issue</DrawerTitle>
                    <DrawerDescription />
                </DrawerHeader>

                {/* Create Issue form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-4 space-y-4 mb-5"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-1"
                        >
                            Title
                        </label>
                        <Input
                            placeholder="Enter issue title"
                            id="title"
                            {...register("title")}
                            className="shadow-none border-neutral-400"
                        />
                        {errors.title && (
                            <p className="text-red-600 text-sm mt-1 ml-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Assignee */}
                    <div>
                        <label
                            htmlFor="assigneeId"
                            className="block text-sm font-medium mb-1"
                        >
                            Assignee
                        </label>
                        <Controller
                            name="assigneeId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="shadow-none border-neutral-400">
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {_orgMembers?.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.assigneeId && (
                            <p className="text-red-600 text-sm mt-1 ml-1">
                                {errors.assigneeId.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-1"
                        >
                            Description
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    data-color-mode="light"
                                />
                            )}
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium mb-1"
                        >
                            Priority
                        </label>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="shadow-none border-neutral-400">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="HIGH">
                                            High
                                        </SelectItem>
                                        <SelectItem value="URGENT">
                                            Urgent
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <Button
                        type="submit"
                        disabled={issueLoading}
                        className="w-full"
                    >
                        {issueLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Create Issue"
                        )}
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateIssueDrawer;
