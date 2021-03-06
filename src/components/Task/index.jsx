import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalculateRemainingTime, ConvertToHumanReadableDate } from "utils/DateHelpers";
import DragHandler from "components/UI/DragHandler";
import catchAsync from "utils/CatchAsync";
import { SortableElement } from "react-sortable-hoc";
import { useDeleteTaskQuery, useUpdateTaskQuery } from "hooks/useTasksData";
import SelectMenu from "components/UI/SelectMenu";
import Member from "components/Member";
import CompleteButton from "components/UI/CompleteButton";
import ReactTooltip from "react-tooltip";
import "./task.scss";

export const Task = ({
    task,
    secondaryColor,
    dragHandlerIcon = true,
    backgroundLocation,
    showParents,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTaskChecked, setIsTaskChecked] = useState(Boolean(task.completed));

    const { mutateAsync: deleteTask } = useDeleteTaskQuery(
        task.task ? task.task : task.section.id,
        !!task.task
    );
    const { mutateAsync: updateTask } = useUpdateTaskQuery(
        task.task ? task.task : task.section.id,
        !!task.task
    );

    const completeTaskHandler = catchAsync(
        async () => {
            setIsTaskChecked(!Boolean(task.completed));
            setTimeout(async () => {
                await updateTask({ taskData: task, data: { completed: !Boolean(task.completed) } });
            }, 1000);
        },
        {
            onLoad: `Completing task ${task.title}`,
            onSuccess: `Task ${task.title} Completed`,
            onError: `Completing task ${task.title} failed`,
        },
        () => setIsTaskChecked(Boolean(task.completed))
    );

    const deleteTaskHandler = catchAsync(
        async () => {
            await deleteTask(task);
        },
        {
            onLoad: `Deleting task ${task.title}`,
            onSuccess: `Task ${task.title} deleted`,
            onError: `Deleting task ${task.title} failed`,
        }
    );

    const [isDeadLineActive, setIsDeadLineActive] = useState(false);

    useEffect(() => {
        ReactTooltip.rebuild();

        if (task.schedule) {
            const { remaining, total } = CalculateRemainingTime(task.created, task.schedule);
            const { readableDate, isLeft } = ConvertToHumanReadableDate(remaining);

            if (remaining <= Math.floor(total / 5)) {
                if (isLeft) setIsDeadLineActive(readableDate + " left");
                else setIsDeadLineActive("Finished " + readableDate + " ago");
            } else {
                setIsDeadLineActive(false);
            }
        }
    }, []);

    const selectMenuOptions = [
        {
            iconClass: "far fa-pen",
            text: "Edit",
            action: () => {
                navigate({
                    pathname: `/update-task/${task.id}/${task.task ? task.task : task.section.id}/${
                        task.section.project.id
                    }`,
                    search: `?bl=${JSON.stringify(
                        backgroundLocation ? backgroundLocation : location
                    )}&isSubTask=${!!task.task}`,
                });
            },
        },
        {
            iconClass: "far fa-trash-alt",
            text: "Delete",
            action: deleteTaskHandler,
            yesNoQAlert: "Are you sure to delete this task ?",
            color: "danger",
        },
    ];

    return (
        <div className="task" style={{ marginTop: showParents ? "2rem" : "1rem" }}>
            {showParents && (
                <div className="task-parents-list">
                    <span
                        className="task-parents-list-section"
                        data-tip={`Section : ${task.section.title}`}
                        data-effect="solid"
                    >
                        {task.section.title} {">"}
                    </span>

                    {task.parent_tasks
                        .map((parentTask) => (
                            <span
                                className="task-parents-list-task"
                                data-tip={`Task : ${parentTask.title}`}
                                data-effect="solid"
                                onClick={() => {
                                    navigate({
                                        pathname: "/task/" + parentTask.id,
                                        search: `?bl=${JSON.stringify(
                                            backgroundLocation ? backgroundLocation : location
                                        )}
                                             &p=${location.pathname}`,
                                    });
                                }}
                            >
                                {parentTask.title} {">"} <span />
                            </span>
                        ))
                        .reverse()}
                </div>
            )}

            <div
                className={[
                    "task-body",
                    isDeadLineActive ? "task-deadline-warning-active" : null,
                    secondaryColor ? "task-color-secondary" : null,
                    task.color ? `task-bg-color-${task.color}` : null,
                ].join(" ")}
                onClick={() => {
                    navigate({
                        pathname: "/task/" + task.id,
                        search: `?bl=${JSON.stringify(
                            backgroundLocation ? backgroundLocation : location
                        )}&p=${location.pathname}`,
                    });
                }}
            >
                <div className="task-input">
                    {dragHandlerIcon ? <DragHandler /> : null}
                    <CompleteButton
                        priorityColor={task.priority}
                        isCompleted={isTaskChecked}
                        onChange={completeTaskHandler}
                    />
                    <span className="task-input-title" data-tip={task.title} data-effect="solid">
                        {task.title}
                    </span>
                </div>
                <div className="task-info">
                    {task.schedule && isDeadLineActive && (
                        <div
                            className="task-info-deadline-warning"
                            data-tip={isDeadLineActive}
                            data-effect="solid"
                        >
                            <span className="far fa-alarm-exclamation" />
                        </div>
                    )}

                    {task.assignee && (
                        <Member
                            picture={task.assignee.profile_img}
                            name={task.assignee.first_name}
                            style={{ marginLeft: "14px", width: "26px", height: "26px" }}
                        />
                    )}

                    <SelectMenu
                        options={selectMenuOptions}
                        type="executable-options"
                        buttonAxis="v"
                        style={{ margin: "2px 4px 0 0" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SortableElement(Task);
