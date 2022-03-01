import React, {useState} from 'react';
import Modal from "components/UI/Modal";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteTaskQuery, useTaskQuery, useTasksQuery, useUpdateTaskQuery} from "hooks/useTasksData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import CompleteButton from "components/UI/CompleteButton";
import catchAsync from "utils/CatchAsync";
import SelectMenu from "components/UI/SelectMenu";
import Member from "components/Member";
import {REACT_MODAL_OPTIONS} from "config";
import LabelItem from "components/LabelItem";
import {useQueryClient} from "react-query";
import {ShowTasks} from "components/ShowTasks";
import Button from "components/UI/Button";
import "./showTasks.scss";
import ScheduleProgressBar from "components/ScheduleProgressBar";

const ShowTask = () => {
    const {taskId} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const labels = queryClient.getQueryData("labels");
    const [isTaskChecked, setIsTaskChecked] = useState(false);

    const {data: task} = useTaskQuery(taskId, {
        onError: () => navigate('/404')
    });

    const {mutateAsync: updateTask} = useUpdateTaskQuery(task?.id, task?.task ? task?.task : task?.section.id, !!task?.task);

    const {mutateAsync: deleteTask} = useDeleteTaskQuery(task?.task ? task?.task : task?.section.id, !!task?.task);

    const {data: subTasks} = useTasksQuery(task?.id, true, {
        enabled: !!task
    });

    const deleteTaskHandler = catchAsync(async () => {
        await deleteTask(task?.id);
    }, {
        onLoad: `Deleting task ${task?.title}`,
        onSuccess: `Task ${task?.title} deleted`,
        onError: `Deleting task ${task?.title} failed`
    });

    const completeTaskHandler = catchAsync(async () => {
        setIsTaskChecked(true);
        await updateTask({id: task?.id, data: {completed: true}});
        closeModal();
    }, {
        onLoad: `Completing task ${task?.title}`,
        onSuccess: `Task ${task?.title} Completed`,
        onError: `Completing task ${task?.title} failed`
    }, () => setIsTaskChecked(false));

    const selectMenuOptions = [{
        iconClass: "far fa-pen", text: "Edit", action: () => {
            navigate(`/tasks/update-task/${task.id}/${task.task ? task.task : task.section.id}/${task.section.project.id}?isSubTask=${!!task.task}`)
        }
    }, {
        iconClass: "far fa-trash-alt",
        text: "Delete",
        action: deleteTaskHandler,
        yesNoQAlert: "Are you sure to delete this task ?",
        color: "danger"
    }];

    const renderLabels = () => {
        const labelsId = task?.label.map(label => label.id);
        const labelsToShow = labels.filter(label => labelsId?.includes(label.id));

        return labelsToShow.map((label) => {
            return (<LabelItem key={label.id} title={label.title} onClick={() => navigate("/labels/" + label.id)}/>);
        });
    }

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => navigate("/tasks"), REACT_MODAL_OPTIONS.closeTimeoutMS)
    }

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div
                className="show-task-modal"
                // style={task?.color ? {backgroundColor: `var(--color-${task?.color})`} : null}
            >
                <LoadingWrapper show={(!!task)} type="dots" size="sm">
                    <div className="show-task-modal-wrapper">
                        <div className="show-task-modal-head">
                            <div className="show-task-modal-head-left">
                                <CompleteButton
                                    priorityColor={task?.priority}
                                    isCompleted={isTaskChecked}
                                    onChange={completeTaskHandler}
                                />
                                <div className="show-task-modal-head-left-title">
                                    <h5>{task?.title}</h5>
                                    {task && (
                                        <span>
                                        {new Date(task.created).toLocaleDateString()} {new Date(task.created).toLocaleTimeString()}
                                    </span>
                                    )}
                                </div>
                            </div>
                            <div className="show-task-modal-head-right">
                                {task?.assignee && (<Member
                                    picture={task.assignee.profile_img}
                                    name={task.assignee.username}
                                    style={{width: "26px", height: "26px"}}
                                />)}
                                <SelectMenu
                                    options={selectMenuOptions}
                                    type="executable-options"
                                    buttonAxis="v"
                                />
                            </div>
                        </div>
                        <div className="show-task-modal-body">
                            {task?.description && <p>{task.description}</p>}
                            <ul>
                                {renderLabels()}
                            </ul>
                            {task && task.schedule &&
                                <ScheduleProgressBar width={150} deadTime={task.schedule} createdTime={task.created}/>
                            }
                        </div>
                        <div className="show-task-modal-footer">
                            <div className="show-task-modal-body-subtasks">
                                <LoadingWrapper show={!!subTasks} type="dots" size="sm">
                                    <div className="show-task-modal-body-subtasks-wrapper">
                                        {subTasks && (
                                            <ShowTasks
                                                sortable={false}
                                                tasks={subTasks}
                                                onSortEnd={null}
                                                axis="y"
                                            />
                                        )}
                                        <div className="show-task-subtasks-add-button">
                                            <Button
                                                style={{marginTop: subTasks?.length !== 0 ? "1rem" : null}}
                                                iconClass="far fa-plus"
                                                onClick={() => navigate(`/tasks/create-task/${task?.section.id}/${task?.id}/${task?.section.project.id}?isSubTask=true`)}
                                                size="sm"
                                                circleShape
                                            />
                                        </div>
                                    </div>
                                </LoadingWrapper>
                            </div>
                        </div>
                    </div>
                </LoadingWrapper>
            </div>
        </Modal>
    )
}

export default ShowTask;