"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IIssue, IUser, TIssuePriority } from "@/lib/interfaces";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface IIssuesBoardFilters {
    issues: IIssue[];
    onFilterChange: (issues: IIssue[]) => void;
}

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const IssuesBoardFilters = ({
    issues,
    onFilterChange,
}: IIssuesBoardFilters) => {
    // hooks

    // states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
        []
    );
    const [selectedPriority, setSelectedPriority] = useState<
        TIssuePriority | string
    >("");

    // vars
    const assignees = issues
        .map((issue) => issue.assignee as IUser)
        .filter(
            (item, index, self) =>
                index === self.findIndex((t) => t?.id === item?.id)
        );

    const isFiltersApplied =
        searchTerm !== "" ||
        selectedAssigneeIds.length > 0 ||
        selectedPriority !== "";

    // actions
    const onToggleAssignee = (assigneeId: string) => {
        setSelectedAssigneeIds((prev) =>
            prev.includes(assigneeId)
                ? prev.filter((id) => id !== assigneeId)
                : [...prev, assigneeId]
        );
    };

    const onClearFilters = () => {
        setSearchTerm("");
        setSelectedAssigneeIds([]);
        setSelectedPriority("");
    };

    // effect
    useEffect(() => {
        const filteredIssues = issues.filter(
            (issue) =>
                issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedAssigneeIds.length === 0 ||
                    selectedAssigneeIds.includes(
                        issue.assignee?.id as string
                    )) &&
                (selectedPriority === "" || issue.priority === selectedPriority)
        );
        onFilterChange(filteredIssues);
    }, [searchTerm, selectedAssigneeIds, selectedPriority, issues]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-4">
                <div className="flex gap-3 items-center sm:gap-6">
                    <div className="w-full flex items-center border bg-white rounded-md pl-2 shadow-sm">
                        <Search className="size-4 text-neutral-500" />
                        <Input
                            className="w-full sm:w-72 bg-transparent border-none shadow-none pl-1"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <div className="flex gap-2 flex-wrap">
                            {assignees.map((assignee, i) => {
                                const selected = selectedAssigneeIds.includes(
                                    assignee?.id
                                );

                                return (
                                    <div
                                        key={assignee.id}
                                        className={`rounded-full ${
                                            selected
                                                ? " ring ring-green-600"
                                                : ""
                                        } ${i > 0 ? "-ml-6" : ""}`}
                                        style={{
                                            zIndex: i,
                                        }}
                                        onClick={() =>
                                            onToggleAssignee(assignee.id)
                                        }
                                    >
                                        <Avatar className="h-10 w-10 hover:scale-105 cursor-pointer">
                                            <AvatarImage
                                                src={assignee.imageUrl}
                                            />
                                            <AvatarFallback>
                                                {assignee.name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Select
                    value={selectedPriority}
                    onValueChange={(value) =>
                        setSelectedPriority(value as TIssuePriority)
                    }
                >
                    <SelectTrigger className="w-full sm:w-52 bg-white">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isFiltersApplied && (
                    <Button
                        variant="ghost"
                        onClick={onClearFilters}
                        className="flex items-center"
                    >
                        <X className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default IssuesBoardFilters;
