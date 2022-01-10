import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteTask, fetchTasks, updateTask} from "store/actions/ApiCalls.actions";
import {toast} from "react-toastify";
import {setData} from "store/actions/Main.actions";
import {useNavigate, useLocation} from "react-router-dom";
import {SortableHandle, SortableElement} from "react-sortable-hoc";
import "./task.scss";
import Spinner from "../UI/Spinner/Spinner";

const DragHandle = SortableHandle(() => {
    return (
        <div className="tasks-draggable-icon">
            <span className="far fa-arrows"></span>
        </div>
    );
});

const Task = ({task}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const priorities = useSelector(state => state.main.priorities);
    const [isTaskChecked, setIsTaskChecked] = useState(false);

    const toastifyOptions = {
        autoClose: 2000, closeOnClick: true, position: "top-center", pauseOnHover: false, hideProgressBar: true,
    };


    const onCheckBoxChanged = async (e) => {
        setIsTaskChecked(true);

        try {
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

            toast.success("Task Updated", toastifyOptions);
        } catch (error) {
            setIsTaskChecked(false);
            toast.error("Update Task Failed", toastifyOptions);
        }
    };

    const [isSubTasksLoading, setIsSubTasksLoading] = useState(false);

    const fetchAndShowSubTasks = async () => {
        try {
            if (task.tasks === null) {

                setIsSubTasksLoading(true)

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

                setIsSubTasksLoading(false)
            }

            navigate('/tasks/subtasks', {state: {previousPath: location.pathname, parentTask: task}})

        } catch (error) {
            setIsSubTasksLoading(false)
            console.log(error)
        }
    }

    const DeleteTask = async () => {
        const alertId = toast.loading("Deleting Task", toastifyOptions);

        try {
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

            toast.update(alertId, {
                render: "Task Deleted",
                type: "success",
                isLoading: false,
                ...toastifyOptions
            });
        } catch (error) {
            console.log(error)
            toast.update(alertId, {
                render: "Deleting Task Failed",
                type: "error",
                isLoading: false,
                ...toastifyOptions
            });
        }
    }

    const [isMouseDown, setIsMouseDown] = useState(false);

    return (
        <div className="task">
            <div className="task-input" style={{backgroundColor: task.color}}>
                <DragHandle/>
                <input
                    type="checkbox"
                    id={`task-radio-btn-${task.id}`}
                    onChange={onCheckBoxChanged}
                    disabled={isTaskChecked}
                    hidden
                />
                <label
                    className={[
                        "task-input-checkbox-label",
                        isTaskChecked ? "task-input-checkbox-label-active" : null,
                        isMouseDown ? "task-input-checkbox-label-mouse-down" : null
                    ].join(' ')}
                    htmlFor={`task-radio-btn-${task.id}`}
                    onMouseDown={() => setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseLeave={() => setIsMouseDown(false)}
                >
                    <span className="far fa-check"></span>
                </label>
                <span className="task-input-title">{task.title}</span>
            </div>
            <div className="task-info">
                {/*<div className="task-info-comments">*/}
                {/*    <span className="far fa-comment"></span>*/}
                {/*    <span className="comments-count">5</span>*/}
                {/*</div>*/}
                <div className="task-info-sub-tasks" onClick={fetchAndShowSubTasks}>
                    {
                        !isSubTasksLoading ? (
                            <>
                                <span className="far fa-code-merge"></span>
                                <span className="sub-tasks-count">2</span>
                            </>
                        ) : <Spinner type="circle" size="sm"/>
                    }
                </div>
                <button
                    className="task-info-modify"
                    onClick={() => navigate(`/tasks/modify/${task.id}`, {state: task})}
                >
                    <span className="far fa-pen"></span>
                </button>
                <button className="task-info-delete" onClick={DeleteTask}>
                    <span className="far fa-trash-alt"></span>
                </button>
                {task.priority ?
                    <div className="task-info-priority">
                        <span
                            className="fa fa-flag"
                            style={{color: `var(--color-priority-${task.priority})`}}
                        ></span>
                    </div> : null}
            </div>
        </div>
    );
};

export default SortableElement(Task);
