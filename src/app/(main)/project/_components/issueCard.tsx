"use client";

import UserAvatar from "@/components/custom/userAvatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IIssue } from "@/lib/interfaces";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IssueDetailsDialog from "./issueDetailsDialog";

interface IIssueCard {
    issue: IIssue;
    onDelete?: () => Promise<boolean>;
    onUpdate?: (update: IIssue) => void;
    showStatus?: boolean;
}

const priorityBorderColor = {
    LOW: "border-green-500",
    MEDIUM: "border-yellow-500",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",
};

const priorityBgColor = {
    LOW: "bg-green-600 hover:bg-green-600",
    MEDIUM: "bg-yellow-600 hover:bg-yellow-600",
    HIGH: "bg-orange-600 hover:bg-orange-600",
    URGENT: "bg-red-600 hover:bg-red-600",
};

const IssueCard = ({ issue, onDelete, onUpdate, showStatus }: IIssueCard) => {
    // hooks
    const router = useRouter();

    // state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // actions
    const onDeleteHandler = async () => {
        router.refresh();
        if (onDelete) await onDelete();
    };

    const onUpdateHandler = (issue: IIssue) => {
        router.refresh();
        if (onUpdate) onUpdate(issue);
    };

    // vars
    const createdTime = formatDistanceToNow(new Date(issue.createdAt), {
        addSuffix: true,
    });

    return (
        <div className="mb-4">
            <Card
                className="cursor-pointer hover:scale-105 transition border-none bg-white rounded-lg "
                onClick={() => setIsDialogOpen(true)}
            >
                <CardHeader
                    className={` border-t-8 ${
                        priorityBorderColor[issue.priority]
                    } rounded-lg`}
                >
                    <CardTitle>{issue.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex gap-2 -mt-3">
                    <Badge
                        className={`-ml-1 ${priorityBgColor[issue.priority]} `}
                    >
                        {issue.priority}
                    </Badge>
                    {showStatus && (
                        <Badge variant="secondary" className="-ml-1">
                            {issue.status}
                        </Badge>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-3">
                    <UserAvatar user={issue.assignee} />

                    <div className="text-xs text-gray-500 w-full">
                        Created {createdTime}
                    </div>
                </CardFooter>
            </Card>

            {isDialogOpen && (
                <IssueDetailsDialog
                    onClose={() => setIsDialogOpen(false)}
                    issue={issue}
                    onDelete={onDeleteHandler}
                    onUpdate={onUpdateHandler}
                    borderColor={priorityBorderColor[issue.priority]}
                    isProjectPage={showStatus}
                />
            )}
        </div>
    );
};

export default IssueCard;
