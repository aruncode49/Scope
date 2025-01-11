"use client";

import { ISprint, TSprintStatus } from "@/lib/interfaces";
import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprints";
import { Loader2 } from "lucide-react";

interface ISprintManager {
    activeSprint: ISprint;
    onUpdateActiveSprint: (sprint: ISprint) => void;
    sprints: ISprint[];
    projectId: string;
}

const SprintManager = (props: ISprintManager) => {
    // props
    const { activeSprint, onUpdateActiveSprint, projectId, sprints } = props;

    // hooks
    const { data, loading, makeRequest } = useFetch({
        cb: updateSprintStatus,
    });

    // state
    const [status, setStatus] = useState<TSprintStatus>(activeSprint.status);

    // vars
    const startDate = new Date(activeSprint.startDate);
    const endDate = new Date(activeSprint.endDate);
    const today = new Date();

    const canStartSprint =
        isBefore(today, endDate) &&
        isAfter(today, startDate) &&
        status === "PLANNED";

    const canEndSprint = status === "ACTIVE";

    // actions
    const onSprintChange = (id: string) => {
        const selectedSprint = sprints.find((sprint) => sprint.id === id);
        onUpdateActiveSprint(selectedSprint as ISprint);
        setStatus(selectedSprint?.status!);
    };

    const getStatusText = () => {
        if (status === "COMPLETED") {
            return `Sprint Ended`;
        }
        if (status === "ACTIVE" && isAfter(today, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`;
        }
        if (status === "PLANNED" && isBefore(today, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)}`;
        }
        return null;
    };

    const onUpdateSprintStatus = async (status: TSprintStatus) => {
        await makeRequest(activeSprint.id, status);
    };

    useEffect(() => {
        if (data && data.success) {
            setStatus(data.sprint.status);
            onUpdateActiveSprint({
                ...activeSprint,
                status: data.sprint.status,
            });
        }
    }, [data]);

    return (
        <div className="mt-8">
            <div className="space-y-2">
                <label
                    htmlFor="manage-sprint"
                    className="text-sm font-medium text-neutral-700"
                >
                    <span>Manage Sprint</span>
                    {getStatusText() && (
                        <Badge variant="secondary" className="ml-2">
                            {getStatusText()}
                        </Badge>
                    )}
                </label>

                <div className="flex items-center gap-3">
                    <Select
                        value={activeSprint.id}
                        onValueChange={onSprintChange}
                    >
                        <SelectTrigger className="bg-white self-start">
                            <SelectValue
                                placeholder="Select Sprint"
                                className="text-sm font-medium"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {sprints.map((sprint) => (
                                <SelectItem key={sprint.id} value={sprint.id}>
                                    <span className="text-xs sm:text-sm">
                                        {sprint.name} (
                                        {format(
                                            sprint.startDate,
                                            "d MMM, yyyy"
                                        )}{" "}
                                        to{" "}
                                        {format(sprint.endDate, "d MMM, yyyy")})
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {canStartSprint && (
                        <Button
                            onClick={() => onUpdateSprintStatus("ACTIVE")}
                            className="bg-green-800 hover:bg-green-900 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Start"
                            )}
                        </Button>
                    )}
                    {canEndSprint && (
                        <Button
                            onClick={() => onUpdateSprintStatus("COMPLETED")}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "End"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SprintManager;
