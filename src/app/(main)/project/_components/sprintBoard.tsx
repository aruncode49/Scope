"use client";

import { ISprint } from "@/lib/interfaces";
import SprintManager from "./sprintManager";
import { useState } from "react";

interface ISprintBoard {
    sprints: ISprint[];
    projectId: string;
    orgId: string;
}

const SprintBoard = ({ sprints, projectId, orgId }: ISprintBoard) => {
    const [activeSprint, setActiveSprint] = useState<ISprint>(
        sprints.find((sprint) => sprint.status === "ACTIVE") ?? sprints[0]
    );

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
        </div>
    );
};

export default SprintBoard;
