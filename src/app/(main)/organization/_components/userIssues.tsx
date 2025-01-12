import { getUserIssues } from "@/actions/issues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IIssue } from "@/lib/interfaces";
import React, { Suspense } from "react";
import IssueCard from "../../project/_components/issueCard";

const UserIssues = async ({ userId }: { userId: string }) => {
    const userIssues = await getUserIssues(userId);

    if (userIssues.length === 0) {
        return null;
    }

    // vars
    const assignedIssues = userIssues.filter(
        (issue) => issue.assignee?.clerkUserId === userId
    ) as IIssue[];
    const reportedIssues = userIssues.filter(
        (issue) => issue.reporter?.clerkUserId === userId
    ) as IIssue[];

    return (
        <div className="mt-6 mb-10">
            <h1 className="text-lg font-semibold">All Issues</h1>
            <Tabs defaultValue="assigned" className="w-full">
                <TabsList className="mt-2 mb-4 bg-neutral-200 gap-3 w-fit mx-auto flex sm:mx-0">
                    <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
                    <TabsTrigger value="reported">Reported by You</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned">
                    <Suspense fallback={<div>Loading...</div>}>
                        <IssueGrid issues={assignedIssues} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="reported">
                    <Suspense fallback={<div>Loading...</div>}>
                        <IssueGrid issues={reportedIssues} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserIssues;

const IssueGrid = ({ issues }: { issues: IIssue[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} showStatus />
            ))}
        </div>
    );
};
