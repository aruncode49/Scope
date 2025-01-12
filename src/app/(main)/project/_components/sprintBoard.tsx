"use client";

import { IIssue, ISprint, TIssueStatus } from "@/lib/interfaces";
import SprintManager from "./sprintManager";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import statuses from "@/constants/status.json";
import { Button } from "@/components/ui/button";
import { LayoutList, Loader, PlusCircle } from "lucide-react";
import CreateIssueDrawer from "./createIssueDrawer";
import { useFetch } from "@/hooks/useFetch";
import { getIssuesBySprintId, updateIssueOrder } from "@/actions/issues";
import SuspenseLoader from "@/components/custom/suspenseLoader";
import IssueCard from "./issueCard";
import { toast } from "sonner";
import IssuesBoardFilters from "./issuesBoardFilters";

interface ISprintBoard {
    sprints: ISprint[];
    projectId: string;
    orgId: string;
}

const SprintBoard = ({ sprints, projectId, orgId }: ISprintBoard) => {
    // hooks
    const {
        loading: issuesLoading,
        makeRequest: fetchIssues,
        data: issues,
        setData: setIssues,
    } = useFetch({
        cb: getIssuesBySprintId,
    });

    const { makeRequest: updateIssueOrderList, loading: updateIssuesLoading } =
        useFetch({
            cb: updateIssueOrder,
        });

    // states
    const [activeSprint, setActiveSprint] = useState<ISprint>(
        sprints.find((sprint) => sprint.status === "ACTIVE") ?? sprints[0]
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedIssueStatus, setSelectedIssueStatus] =
        useState<TIssueStatus | null>(null);

    const [filteredIssues, setFilteredIssues] = useState<IIssue[]>(
        issues || []
    );

    // actions

    const onFilterChange = (filteredIssues: IIssue[]) => {
        setFilteredIssues(filteredIssues);
    };

    const reorderIssueList = (
        list: IIssue[],
        startIndex: number,
        lastIndex: number
    ) => {
        // create a copy of our original issue so that it doesn't mutate that.
        const listCopy = Array.from(list);

        // removed the source issue from the list
        const [removedIssue] = listCopy.splice(startIndex, 1);

        // place the removed issue at the destination index
        listCopy.splice(lastIndex, 0, removedIssue);
        return listCopy;
    };

    const onDragEnd = async (result: DropResult<string>) => {
        if (activeSprint.status === "PLANNED") {
            toast.warning("Please start your sprint to update the board.");
            return;
        }

        if (activeSprint.status === "COMPLETED") {
            toast.warning(
                "You cannot update the board after sprint is completed."
            );
            return;
        }

        const { destination, source } = result;

        if (!destination) {
            return;
        }

        // placing the issue on same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newOrderedData = [...(issues as IIssue[])];

        // source and destination list
        const sourceList = newOrderedData.filter(
            (issue) => issue.status === source.droppableId
        );

        const destinationList = newOrderedData.filter(
            (issue) => issue.status === destination.droppableId
        );

        // move the issue in same list
        if (source.droppableId === destination.droppableId) {
            const reorderIssuesList = reorderIssueList(
                sourceList,
                source.index,
                destination.index
            );

            //
            reorderIssuesList.forEach((issue, index) => {
                issue.order = index;
            });
        } else {
            // move the issue in different list
            // step:1 (removed the source card from the source list)
            const [removedIssue] = sourceList.splice(source.index, 1);

            // step:2 (assign the destination id to removed card)
            removedIssue.status = destination.droppableId as TIssueStatus;

            // step:3 (add removed card to the destination list)
            destinationList.splice(destination.index, 0, removedIssue);

            // update the order of source list
            sourceList.forEach((issue, index) => {
                issue.order = index;
            });

            // update the order of destination list
            destinationList.forEach((issue, index) => {
                issue.order = index;
            });
        }

        const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
        setIssues(sortedIssues);

        // update api call
        await updateIssueOrderList(sortedIssues);
    };

    const onClickCreateIssue = (status: TIssueStatus) => {
        setIsDrawerOpen(true);
        setSelectedIssueStatus(status);
    };

    const onIssueCreated = async () => {
        await fetchIssues(activeSprint.id);
    };

    // effects
    useEffect(() => {
        if (activeSprint) {
            fetchIssues(activeSprint.id);
        }
    }, [activeSprint]);

    return (
        <div className="mb-16">
            {/* sprint manager */}
            <SprintManager
                activeSprint={activeSprint}
                onUpdateActiveSprint={setActiveSprint}
                sprints={sprints}
                projectId={projectId}
            />

            <div className="mt-8">
                <h1 className="text-2xl font-semibold text-neutral-900 flex items-center gap-2">
                    <LayoutList />
                    Manage Your Sprint
                </h1>

                {/* issues filters */}
                {issues && issues.length > 0 && (
                    <IssuesBoardFilters
                        issues={issues}
                        onFilterChange={onFilterChange}
                    />
                )}
            </div>

            {/* kanban board */}
            <>
                {issuesLoading ? (
                    <SuspenseLoader />
                ) : (
                    <div className="relative">
                        {updateIssuesLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg text-white">
                                <Loader className="size-8 mr-2 animate-spin" />
                                Updating Board..
                            </div>
                        )}

                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="grid grid-flow-col gap-x-6 auto-cols-[16rem] md:auto-cols-[19rem] justify-between p-4 mt-6 rounded-lg bg-fuchsia-950 overflow-x-auto w-full">
                                {statuses.map((col) => (
                                    <Droppable
                                        key={col.key}
                                        droppableId={col.key}
                                    >
                                        {(provided) => (
                                            <div
                                                className="p-3 rounded-lg bg-white/5 border border-fuchsia-900"
                                                ref={provided.innerRef}
                                            >
                                                <h1 className="mb-4 text-white w-fit mx-auto px-6 py-1 rounded-full bg-fuchsia-900 border-b border-neutral-200">
                                                    {col.name}
                                                </h1>

                                                {filteredIssues
                                                    ?.filter(
                                                        (issue) =>
                                                            issue.status ===
                                                            col.key
                                                    )
                                                    .map((issue, index) => (
                                                        <Draggable
                                                            draggableId={
                                                                issue.id
                                                            }
                                                            index={index}
                                                            key={issue.id}
                                                            isDragDisabled={
                                                                updateIssuesLoading
                                                            }
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.dragHandleProps}
                                                                    {...provided.draggableProps}
                                                                >
                                                                    <IssueCard
                                                                        issue={
                                                                            issue
                                                                        }
                                                                        onDelete={async () =>
                                                                            await fetchIssues(
                                                                                activeSprint.id
                                                                            )
                                                                        }
                                                                        onUpdate={(
                                                                            updated
                                                                        ) =>
                                                                            setIssues(
                                                                                (
                                                                                    issues
                                                                                ) =>
                                                                                    issues?.map(
                                                                                        (
                                                                                            issue
                                                                                        ) => {
                                                                                            if (
                                                                                                issue?.id ===
                                                                                                updated?.id
                                                                                            )
                                                                                                return updated;
                                                                                            return issue;
                                                                                        }
                                                                                    )
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}

                                                {/* Issues */}
                                                {provided.placeholder}

                                                {col.key === "TODO" &&
                                                    activeSprint.status !==
                                                        "COMPLETED" && (
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full text-center text-white bg-white/15 hover:bg-white/90"
                                                            onClick={() =>
                                                                onClickCreateIssue(
                                                                    col.key as TIssueStatus
                                                                )
                                                            }
                                                        >
                                                            <PlusCircle />
                                                            Create Issue
                                                        </Button>
                                                    )}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </DragDropContext>
                    </div>
                )}
            </>

            <CreateIssueDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={activeSprint.id}
                status={selectedIssueStatus}
                projectId={projectId}
                onIssueCreated={onIssueCreated}
                orgId={orgId}
            />
        </div>
    );
};

export default SprintBoard;
