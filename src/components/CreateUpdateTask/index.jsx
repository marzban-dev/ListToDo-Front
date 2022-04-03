import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { REACT_MODAL_OPTIONS } from "config";
import Button from "components/UI/Button";
import catchAsync from "utils/CatchAsync";
import { useCreateTaskQuery, useTaskQuery, useUpdateTaskQuery } from "hooks/useTasksData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SelectAssignee from "components/UI/SelectAssignee";
import SelectLabels from "components/UI/SelectLabels";
import SelectPriority from "components/UI/SelectPriority";
import SelectSchedule from "components/UI/SelectSchedule";
import SelectColor from "components/UI/SelectColor";
import SelectEvery from "components/UI/SelectEvery";
import { useQueryClient } from "react-query";
import "./createUpdateTask.scss";

export const CreateUpdateTask = ({ mode }) => {
    const { taskId, sectionId, projectId, parentId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState(null);
    const [taskLabels, setTaskLabels] = useState([]);
    const [taskColor, setTaskColor] = useState(null);
    const [taskSchedule, setTaskSchedule] = useState(null);
    const [taskAssignee, setTaskAssignee] = useState(null);
    const [taskEvery, setTaskEvery] = useState(null);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const inboxProject = queryClient.getQueryData("inbox-project");
    const project = queryClient.getQueryData(["project", Number(projectId)]);
    const labels = queryClient.getQueryData("labels");

    const { data: task } = useTaskQuery(taskId, {
        enabled: mode === "modify",
        onError: () => navigate("/404"),
    });
    const { mutateAsync: updateTask } = useUpdateTaskQuery(
        parentId,
        searchParams.get("isSubTask") === "true"
    );
    const { mutateAsync: createTask } = useCreateTaskQuery(
        parentId,
        searchParams.get("isSubTask") === "true"
    );

    if (!!task && taskTitle.length === 0) {
        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskPriority(task.priority ? Number(task.priority) : null);
        setTaskLabels(task.label ? task.label.map((lbl) => lbl.id) : []);
        setTaskColor(task.color);
        setTaskSchedule(task.schedule ? new Date(task.schedule) : null);
        setTaskAssignee(task.assignee);
        setTaskEvery(task.every ? Number(task.every) : null);
    }

    const onTitleChanged = (e) => setTaskTitle(e.target.value);

    const onDescriptionChanged = (e) => setTaskDescription(e.target.value);

    const onSubmitBtnClicked = catchAsync(
        async () => {
            setIsSubmitButtonDisabled(true);

            const dataObject = {
                title: taskTitle,
                description: taskDescription,
                label: taskLabels,
                priority: taskPriority,
                color: taskColor,
                schedule: taskSchedule,
                assignee: taskAssignee,
                task: searchParams.get("isSubTask") === "true" ? parentId : null,
                every: taskEvery,
            };

            if (mode === "create") {
                await createTask({ sectionId: sectionId, data: dataObject });
                setIsSubmitButtonDisabled(false);
            } else {
                await updateTask({ taskData: task, data: dataObject });
                setIsSubmitButtonDisabled(false);
            }
        },
        mode === "modify"
            ? {
                  onLoad: `Updating task ${taskTitle}`,
                  onSuccess: `Task ${taskTitle} updated`,
                  onError: `Updating task ${taskTitle} failed`,
              }
            : {
                  onLoad: `Creating task ${taskTitle}`,
                  onSuccess: `Task ${taskTitle} created`,
                  onError: `Creating task ${taskTitle} failed`,
              },
        () => setIsSubmitButtonDisabled(false)
    );

    const onEnterKeyPressed = (e) => (e.key === "Enter" ? onSubmitBtnClicked() : null);

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => navigate(-1), REACT_MODAL_OPTIONS.closeTimeoutMS);
    };

    const modalContent = (
        <React.Fragment>
            <div className="create-new-task-head-wrapper">
                <input
                    type="text"
                    placeholder="Title"
                    className="title-input"
                    onChange={onTitleChanged}
                    value={taskTitle}
                />
                <div className="head-wrapper-separator">
                    <SelectAssignee
                        taskAssignee={taskAssignee}
                        setTaskAssignee={setTaskAssignee}
                        members={
                            inboxProject.id === Number(projectId)
                                ? inboxProject.users
                                : project.users
                        }
                    />
                    <SelectColor color={taskColor} setColor={setTaskColor} />
                    <SelectPriority priority={taskPriority} setPriority={setTaskPriority} />
                    <SelectEvery every={taskEvery} setEvery={setTaskEvery} />
                </div>
            </div>
            <textarea
                rows="4"
                placeholder="Description"
                className="description-input"
                onChange={onDescriptionChanged}
                value={taskDescription}
            />
            <SelectLabels labelsList={taskLabels} setLabelsList={setTaskLabels} labels={labels} />
            <div className="create-new-task-save col-12">
                <div className="col-10">
                    <SelectSchedule schedule={taskSchedule} setSchedule={setTaskSchedule} />
                </div>
                <Button
                    onClick={!isSubmitButtonDisabled ? onSubmitBtnClicked : null}
                    circleShape
                    size="md"
                    iconClass="far fa-check"
                />
            </div>
        </React.Fragment>
    );

    return (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} {...REACT_MODAL_OPTIONS}>
            <div
                className="create-new-task-modal"
                onKeyPress={(e) => (!isSubmitButtonDisabled ? onEnterKeyPressed(e) : null)}
            >
                {mode === "modify" ? (
                    <LoadingWrapper show={!!task} type="dots" size="sm">
                        {modalContent}
                    </LoadingWrapper>
                ) : (
                    modalContent
                )}
            </div>
        </Modal>
    );
};

export default CreateUpdateTask;
