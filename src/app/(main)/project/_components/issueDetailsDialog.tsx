"use client";

import { deleteIssue, updateIssue } from "@/actions/issues";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { IIssue, TIssuePriority, TIssueStatus } from "@/lib/interfaces";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ExternalLink, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import statuses from "@/constants/status.json";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "@/components/custom/userAvatar";

interface IIssueDetailsDialog {
    onClose: () => void;
    issue: IIssue;
    onDelete: () => Promise<void>;
    onUpdate: (issue: IIssue) => void;
    borderColor: string;
    isProjectPage?: boolean;
}

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const IssueDetailsDialog = ({
    onClose,
    issue,
    onDelete,
    onUpdate,
    borderColor,
    isProjectPage: _isProjectPage,
}: IIssueDetailsDialog) => {
    // hooks
    const { loading: deleteIssueLoading, makeRequest: onDeleteIssue } =
        useFetch({
            cb: deleteIssue,
        });

    const {
        loading: updateIssueLoading,
        makeRequest: onUpdateIssue,
        data: updatedIssue,
    } = useFetch({
        cb: updateIssue,
    });

    const { user } = useUser();
    const { membership } = useOrganization();
    const router = useRouter();
    const pathname = usePathname();

    // states
    const [status, setStatus] = useState<TIssueStatus>(issue.status);
    const [priority, setPriority] = useState<TIssuePriority>(issue.priority);
    const [updateType, setUpdateType] = useState<
        "status" | "priority" | undefined
    >(undefined);

    // vars
    const isAdmin =
        user?.id === issue.reporter?.clerkUserId ||
        membership?.role === "org:admin";
    const isProjectPage = pathname.startsWith("/project/");

    // actions
    const _onDeleteIssue = async () => {
        const isSuccess = await onDeleteIssue(issue.id);
        if (isSuccess) {
            await onDelete();
        }
    };

    const onIssueStatusChange = async (status: TIssueStatus) => {
        setStatus(status);
        setUpdateType("status");
        await onUpdateIssue(issue.id, { status, priority });
    };

    const onIssuePriorityChange = async (priority: TIssuePriority) => {
        setPriority(priority);
        setUpdateType("priority");
        await onUpdateIssue(issue.id, { status, priority });
    };

    const onNavigateToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}/`);
    };

    // effect
    useEffect(() => {
        if (updatedIssue) {
            onUpdate(updatedIssue as IIssue);
            onClose();
        }
    }, [updatedIssue]);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="md:min-w-[50rem]"
            >
                <DialogHeader>
                    <div className="flex items-center gap-1">
                        <DialogTitle className="text-xl">
                            {issue.title}
                        </DialogTitle>
                        {!isProjectPage && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNavigateToProject}
                                title="Go to Project"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <h4 className="font-medium text-sm">Assignee</h4>
                            <UserAvatar user={issue.assignee} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="font-medium text-sm">Reporter</h4>
                            <UserAvatar user={issue.reporter} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">
                                    Issue Status
                                </label>
                                {updateIssueLoading &&
                                    updateType === "status" && (
                                        <Loader2 className="size-4 text-amber-600 animate-spin" />
                                    )}
                            </div>
                            <Select
                                value={status}
                                onValueChange={onIssueStatusChange}
                            >
                                <SelectTrigger
                                    disabled={_isProjectPage}
                                    className="text-xs"
                                >
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((option) => (
                                        <SelectItem
                                            className="text-xs"
                                            key={option.key}
                                            value={option.key}
                                        >
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">
                                    Priority
                                </label>
                                {updateIssueLoading &&
                                    updateType === "priority" && (
                                        <Loader2 className="size-4 text-amber-600 animate-spin" />
                                    )}
                            </div>
                            <Select
                                value={priority}
                                onValueChange={onIssuePriorityChange}
                                disabled={!isAdmin}
                            >
                                <SelectTrigger
                                    disabled={_isProjectPage}
                                    className={`border ${borderColor} rounded text-xs`}
                                >
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem
                                            className="text-xs"
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-1">
                            Description
                        </h4>
                        <MDEditor.Markdown
                            className="rounded p-2"
                            style={{
                                background: "#f5f5f5",
                                fontSize: "0.875rem",
                            }}
                            source={issue.description ?? "--"}
                        />
                    </div>
                    <div className="flex items-center gap-3 justify-self-end">
                        <Button onClick={onClose} variant="outline" size="sm">
                            Cancel
                        </Button>
                        {isAdmin && !_isProjectPage && (
                            <Button
                                onClick={_onDeleteIssue}
                                disabled={deleteIssueLoading}
                                variant="destructive"
                                size="sm"
                            >
                                {deleteIssueLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Delete Issue"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IssueDetailsDialog;
