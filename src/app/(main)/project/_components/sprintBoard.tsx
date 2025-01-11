"use client";

import { ISprint } from "@/lib/interfaces";
import SprintManager from "./sprintManager";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/constants/status.json";

interface ISprintBoard {
    sprints: ISprint[];
    projectId: string;
    orgId: string;
}

const SprintBoard = ({ sprints, projectId, orgId }: ISprintBoard) => {
    // states
    const [activeSprint, setActiveSprint] = useState<ISprint>(
        sprints.find((sprint) => sprint.status === "ACTIVE") ?? sprints[0]
    );

    // actions
    const onDragEnd = () => {};

    return (
        <div>
            {/* sprint manager */}
            <SprintManager
                activeSprint={activeSprint}
                onUpdateActiveSprint={setActiveSprint}
                sprints={sprints}
                projectId={projectId}
            />

            {/* kanban board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {statuses.map((col) => (
                        <Droppable key={col.key} droppableId={col.key}>
                            {(provided) => (
                                <div ref={provided.innerRef}>
                                    <h1>{col.name}</h1>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default SprintBoard;
