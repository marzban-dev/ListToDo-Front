import React, {useState} from "react";
import Modal from "react-modal";
import SelectLabels from "./components/SelectLabels";
import SelectPriority from "./components/SelectPriority";
import SelectSchedule from "./components/SelectSchedule";
import SelectColor from "./components/SelectColor";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {REACT_MODAL_OPTIONS} from "config";
import Button from "components/UI/Button";
import catchAsync from "utils/CatchAsync";
import {useCreateTaskQuery, useTaskQuery, useUpdateTaskQuery} from "hooks/useTasksData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SelectAssignee from "components/CreateUpdateTaskModal/components/SelectAssignee";
import {useQueryClient} from "react-query";
import "./taskModal.scss";

export const CreateUpdateTaskModal = ({mode}) => {
    const {taskId, sectionId, projectId, parentId} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState(null);
    const [taskLabels, setTaskLabels] = useState([]);
    const [taskColor, setTaskColor] = useState(null);
    const [taskSchedule, setTaskSchedule] = useState(null);
    const [taskAssignee, setTaskAssignee] = useState(null);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const inboxProject = queryClient.getQueryData('inbox-project');
    const project = queryClient.getQueryData(['project', Number(projectId)]);
    const labels = queryClient.getQueryData("labels");

    const {data: task} = useTaskQuery(taskId, {
        enabled: mode === "modify",
        onError: () => navigate('/404')
    });
    const {mutateAsync: updateTask} = useUpdateTaskQuery(taskId, parentId, searchParams.get('isSubTask') === "true");
    const {mutateAsync: createTask} = useCreateTaskQuery(parentId, searchParams.get('isSubTask') === "true");

    if (!!task && taskTitle.length === 0) {
        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskPriority(task.priority ? Number(task.priority) : null);
        setTaskLabels(task.label);
        setTaskColor(task.color);
        setTaskSchedule(task.schedule ? new Date(task.schedule) : null)
        setTaskAssignee(task.assignee)
    }

    const onTitleChanged = (e) => setTaskTitle(e.target.value);

    const onDescriptionChanged = (e) => setTaskDescription(e.target.value);

    const onSubmitBtnClicked = catchAsync(async () => {
        setIsSubmitButtonDisabled(true);

        const dataObject = {
            title: taskTitle,
            description: taskDescription,
            label: taskLabels.map(lbl => lbl.id),
            priority: taskPriority,
            color: taskColor,
            schedule: taskSchedule,
            assignee: taskAssignee,
            task: searchParams.get("isSubTask") === "true" ? parentId : null
        };

        if (mode === 'create') {
            await createTask({sectionId: sectionId, data: dataObject});
            setIsSubmitButtonDisabled(false)
        } else {
            await updateTask({id: taskId, data: dataObject});
            setIsSubmitButtonDisabled(false);
        }

    }, mode === 'modify' ? {
        onLoad: `Updating task ${taskTitle}`,
        onSuccess: `Task ${taskTitle} updated`,
        onError: `Updating task ${taskTitle} failed`
    } : {
        onLoad: `Creating task ${taskTitle}`,
        onSuccess: `Task ${taskTitle} created`,
        onError: `Creating task ${taskTitle} failed`
    }, () => setIsSubmitButtonDisabled(false))

    const onEnterKeyPressed = (e) => e.key === "Enter" ? onSubmitBtnClicked() : null;

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => navigate(-1), REACT_MODAL_OPTIONS.closeTimeoutMS)
    }

    const modalContent = (
        <React.Fragment>
            <div className="create-new-task-head-wrapper col-12">
                <input
                    type="text"
                    placeholder="Title"
                    className="title-input col-7"
                    onChange={onTitleChanged}
                    value={taskTitle}
                />
                <div className="head-wrapper-separator col-3">
                    <SelectAssignee
                        taskAssignee={taskAssignee}
                        setTaskAssignee={setTaskAssignee}
                        members={inboxProject.id === Number(projectId) ? inboxProject.users : project.users}
                    />
                    <SelectColor taskColor={taskColor} setTaskColor={setTaskColor}/>
                    <SelectPriority taskPriority={taskPriority} setTaskPriority={setTaskPriority}/>
                </div>
            </div>
            {/*TODO --FIX BUG-- if user focused on textarea, when he pressing enter key ; the form should not send data*/}
            <textarea
                rows="4"
                placeholder="Description"
                className="description-input"
                onChange={onDescriptionChanged}
                value={taskDescription}
            ></textarea>
            <SelectLabels taskLabels={taskLabels} setTaskLabels={setTaskLabels} labels={labels}/>
            <div className="create-new-task-save col-12">
                <SelectSchedule
                    taskSchedule={taskSchedule}
                    setTaskSchedule={setTaskSchedule}
                />
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
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            {...REACT_MODAL_OPTIONS}
        >
            <div
                className="create-new-task-modal"
                onKeyPress={(e) => !isSubmitButtonDisabled ? onEnterKeyPressed(e) : null}
            >
                {
                    mode === "modify" ? (
                        <LoadingWrapper show={(!!task)} type="dots" size="sm">
                            {modalContent}
                        </LoadingWrapper>
                    ) : modalContent
                }
            </div>
        </Modal>
    );
};

export default CreateUpdateTaskModal;
