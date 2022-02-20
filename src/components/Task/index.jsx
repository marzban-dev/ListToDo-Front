import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import ReactTooltip from "react-tooltip";
import {CalculateRemainingTime, ConvertToHumanReadableDate} from "Utils/DateHelpers";
import DragHandler from "components/UI/DragHandler";
import catchAsync from "Utils/CatchAsync";
import {SortableElement} from "react-sortable-hoc";
import {useDeleteTaskQuery, useUpdateTaskQuery} from "hooks/useTasksData";
import SelectMenu from "components/UI/SelectMenu";
import Member from "components/Member";
import "./task.scss";

export const Task = ({task, dragHandlerIcon = true}) => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();
        const [isTaskChecked, setIsTaskChecked] = useState(false);
        const {mutateAsync: deleteTask} = useDeleteTaskQuery(
            task.task ? task.task : task.section.id,
            !!task.task
        );
        const {mutateAsync: updateTask} = useUpdateTaskQuery(
            task.id,
            task.task ? task.task : task.section.id,
            !!task.task
        );

        const completeTaskHandler = catchAsync(async () => {
            setIsTaskChecked(true);
            setTimeout(async () => {
                await updateTask({id: task.id, data: {completed: true}});
            }, 1000);
        }, {
            onLoad: `Completing task ${task.title}`,
            onSuccess: `Task ${task.title} Completed`,
            onError: `Completing task ${task.title} failed`
        }, () => setIsTaskChecked(false));

        const deleteTaskHandler = catchAsync(async () => {
            await deleteTask(task.id);
        }, {
            onLoad: `Deleting task ${task.title}`,
            onSuccess: `Task ${task.title} deleted`,
            onError: `Deleting task ${task.title} failed`
        });

        // const [isSubTasksLoading, setIsSubTasksLoading] = useState(false);

        // const showSubTasks = catchAsync(async () => {
        //     if (task.tasks === null) {
        //         setIsSubTasksLoading(true);
        //
        //         const subTasks = await dispatch(fetchTasks({task: task.id}));
        //
        //         dispatch(setData({
        //             modify: {
        //                 type: 'task',
        //                 part: 'projects',
        //                 id: task.id,
        //                 key: 'id',
        //                 data: {tasks: subTasks},
        //                 nestedProperties: ['projects', 'sections', 'tasks']
        //             }
        //         }));
        //
        //         setIsSubTasksLoading(false);
        //     }
        //     navigate('/tasks/subtasks', {state: {previousPath: location.pathname, parentTask: task}})
        // });

        const [isDeadLineActive, setIsDeadLineActive] = useState(false);

        useEffect(() => {
            if (task.schedule) {
                const {remaining, total} = CalculateRemainingTime(task.created, task.schedule);
                const readableDate = ConvertToHumanReadableDate(remaining);

                if (remaining <= Math.floor(total / 5)) {
                    setIsDeadLineActive(readableDate);
                } else {
                    setIsDeadLineActive(true);
                }
            }
        }, []);

        const [isMouseDown, setIsMouseDown] = useState(false);

        const selectMenuOptions = [
            {
                iconClass: "far fa-pen",
                text: "Edit",
                action: () => {
                    navigate(`update-task/${task.id}/${task.task ? task.task : task.section.id}/${task.section.project.id}?isSubTask=${!!task.task}`)
                }
            },
            {
                iconClass: "far fa-trash-alt",
                text: "Delete",
                action: deleteTaskHandler,
                yesNoQAlert: "Are you sure to delete this task ?",
                color: "danger"
            }
        ]

        return (
            <div
                className={["task", isDeadLineActive ? "task-deadline-warning-active" : null].join(' ')}
                style={task.color ? {backgroundColor: `var(--color-${task.color})`} : null}
            >
                <div className="task-input">
                    {dragHandlerIcon ? <DragHandler/> : null}
                    <input
                        type="checkbox"
                        id={`task-radio-btn-${task.id}`}
                        onChange={completeTaskHandler}
                        disabled={isTaskChecked}
                        hidden
                    />
                    <label
                        className={[
                            "task-input-checkbox-label",
                            isTaskChecked ? "task-input-checkbox-label-active" : null,
                            isMouseDown ? "task-input-checkbox-label-mouse-down" : null,
                        ].join(' ')}
                        htmlFor={`task-radio-btn-${task.id}`}
                        onMouseDown={() => setIsMouseDown(true)}
                        onMouseUp={() => setIsMouseDown(false)}
                        onMouseLeave={() => setIsMouseDown(false)}
                        style={{borderColor: task.priority ? `var(--color-priority-${task.priority})` : null}}
                    >
                        <span className="far fa-check"></span>
                    </label>
                    <span className="task-input-title">{task.title}</span>
                </div>
                <div className="task-info">
                    {isDeadLineActive && (
                        <div className="task-info-deadline-warning" data-tip={isDeadLineActive}>
                            <span className="far fa-alarm-exclamation"></span>
                        </div>
                    )}

                    <ReactTooltip/>
                    {task.assignee && (
                        <Member
                            picture={task.assignee.profile_img}
                            name={task.assignee.username}
                            widthSize="26px"
                            style={{marginLeft: "14px"}}
                        />
                    )}

                    <SelectMenu
                        options={selectMenuOptions}
                        type="executable-options"
                        buttonAxis="v"
                        style={{margin: "2px 4px 0 0"}}
                    />
                </div>
            </div>
        );
    }
;

export default SortableElement(Task);
