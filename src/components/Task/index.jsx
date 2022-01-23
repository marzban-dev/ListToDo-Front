import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {deleteTask, fetchTasks, updateTask} from "store/actions/ApiCalls.actions";
import {setData} from "store/actions/Main.actions";
import {useLocation, useNavigate} from "react-router-dom";
import {SortableElement} from "react-sortable-hoc";
import Spinner from "components/UI/Spinner";
import ReactTooltip from "react-tooltip";
import CalculateRemainingTime from "Utils/CalculateRemainingTime";
import DragHandler from "components/UI/DragHandler";
import catchAsync from "Utils/CatchAsync";
import "./task.scss";

const Task = ({task}) => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();
        const [isTaskChecked, setIsTaskChecked] = useState(false);

        const completeTaskHandler = catchAsync(async () => {
            setIsTaskChecked(true);

            await dispatch(updateTask(task.id, {completed: true}));

            dispatch(setData({
                modify: {
                    type: 'task',
                    part: 'projects',
                    id: task.id,
                    key: 'id',
                    data: {completed: true},
                    nestedProperties: ['projects', 'sections', 'tasks']
                }
            }));
        }, {
            onLoad: "Updating task",
            onSuccess: "Task completed",
            onError: "Update task failed",
        }, () => setIsTaskChecked(false));

        const [isSubTasksLoading, setIsSubTasksLoading] = useState(false);

        const showSubTasks = catchAsync(async () => {
            if (task.tasks === null) {
                setIsSubTasksLoading(true);

                const subTasks = await dispatch(fetchTasks({task: task.id}));

                dispatch(setData({
                    modify: {
                        type: 'task',
                        part: 'projects',
                        id: task.id,
                        key: 'id',
                        data: {tasks: subTasks},
                        nestedProperties: ['projects', 'sections', 'tasks']
                    }
                }));

                setIsSubTasksLoading(false);
            }
            navigate('/tasks/subtasks', {state: {previousPath: location.pathname, parentTask: task}})
        });

        const DeleteTask = catchAsync(async () => {
            await dispatch(deleteTask(task.id));

            dispatch(setData({
                modify: {
                    type: 'task',
                    part: 'projects',
                    id: task.id,
                    key: 'id',
                    nestedProperties: ['projects', 'sections', 'tasks'],
                    deleteMatchedItem: true
                }
            }));

        }, {
            onLoad: "Deleting task",
            onSuccess: "Task deleted",
            onError: "Deleting task failed"
        });

        const [isDeadLineActive, setIsDeadLineActive] = useState(false);

        useEffect(() => {
            if (task.schedule) {
                const remainingTime = CalculateRemainingTime(task.created, task.schedule);
                setIsDeadLineActive(remainingTime)

                setInterval(() => {
                    const remainingTime = CalculateRemainingTime(task.created, task.schedule);
                    setIsDeadLineActive(remainingTime)
                }, 60000)
            }
        }, [])

        const [isMouseDown, setIsMouseDown] = useState(false);

        return (
            <div
                className={["task", isDeadLineActive ? "task-deadline-warning-active" : null].join(' ')}
                // style={{backgroundColor : task.color ? `var(--color-priority-${task.color})` : null}}
            >
                <div className="task-input">
                    <DragHandler/>
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

                    {isDeadLineActive ? (
                        <>
                            <ReactTooltip/>
                            <div className="task-info-item task-info-deadline-warning" data-tip={isDeadLineActive}>
                                <span className="far fa-exclamation-circle"></span>
                            </div>
                        </>
                    ) : null}

                    <button
                        className="task-info-item task-info-sub-tasks"
                        onClick={!isSubTasksLoading ? showSubTasks : null}
                    >
                        {!isSubTasksLoading ? (
                            <>
                                <span className="far fa-code-merge"></span>
                                <span className="sub-tasks-count">5</span>
                            </>
                        ) : <Spinner type="circle" size="sm"/>}
                    </button>

                    <button
                        className="task-info-item task-info-modify"
                        onClick={() => navigate(`/tasks/modify/${task.id}`, {state: task})}
                    >
                        <span className="far fa-pen"></span>
                    </button>

                    <button className="task-info-item task-info-delete" onClick={DeleteTask}>
                        <span className="far fa-trash-alt"></span>
                    </button>
                </div>
            </div>
        );
    }
;

export default SortableElement(Task);
