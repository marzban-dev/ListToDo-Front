import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {createTask, updateTask} from "store/actions/ApiCalls.actions";
import {setData} from "store/actions/Main.actions";
import SelectLabels from "./ModalSections/SelectLabels";
import SelectPriority from "./ModalSections/SelectPriority";
import SelectSchedule from "./ModalSections/SelectSchedule";
import SelectColor from "./ModalSections/SelectColor";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import {TOASTIFY_OPTIONS, REACT_MODAL_OPTIONS} from "config";
import Button from "components/UI/Button/Button";
import "./taskModal.scss";

export const CreateUpdateTaskModal = ({mode}) => {
    const dispatch = useDispatch();
    const {state} = useLocation();
    const {taskId} = useParams();
    const navigate = useNavigate();

    const [taskTitle, setTaskTitle] = useState(mode === 'modify' ? state.title : "");
    const [taskDescription, setTaskDescription] = useState(mode === 'modify' ? state.description : "");
    const [taskPriority, setTaskPriority] = useState(mode === 'modify' ? (state.priority ? Number(state.priority) : null) : null);
    const [taskLabels, setTaskLabels] = useState(mode === 'modify' ? state.label : []);
    const [taskColor, setTaskColor] = useState(mode === 'modify' ? state.color : null);
    const [taskSchedule, setTaskSchedule] = useState(mode === 'modify' ? (state.schedule ? new Date(state.schedule) : null) : null);
    // const [taskAssignee] = useState(mode === 'modify' ? state.assignee : null);

    const [isPriorityListOpen, setIsPriorityListOpen] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    useEffect(() => {
        if (!state) navigate('/');
        Modal.setAppElement("body");
    }, []);

    const onTitleChanged = (e) => setTaskTitle(e.target.value);

    const onDescriptionChanged = (e) => setTaskDescription(e.target.value);

    const onSubmitBtnClicked = async () => {
        setIsSubmitButtonDisabled(true);

        const alertId = toast.loading("Creating Task", TOASTIFY_OPTIONS);

        const dataObject = {
            title: taskTitle,
            description: taskDescription,
            labels: taskLabels.length !== 0 ? taskLabels.map((label) => label.id) : [],
            priority: taskPriority,
            color: taskColor,
            schedule: taskSchedule,
            task: state.taskId ? state.taskId : null
        };

        try {
            if (mode === 'create') {
                console.log(dataObject);
                const createdTask = await dispatch(createTask(state.sectionId, dataObject));

                setIsSubmitButtonDisabled(false);

                dispatch(setData({
                    modify: {
                        type: state.taskId ? 'task' : 'section',
                        part: 'projects',
                        id: state.taskId ? Number(state.taskId) : Number(state.sectionId),
                        key: 'id',
                        data: {tasks: createdTask},
                        nestedProperties: ['projects', 'sections', 'tasks']
                    }
                }));

                toast.update(alertId, {
                    render: "Task Created",
                    type: "success",
                    isLoading: false,
                    ...TOASTIFY_OPTIONS
                });
            } else {
                const updatedTask = await dispatch(updateTask(taskId, dataObject));

                setIsSubmitButtonDisabled(false);

                dispatch(setData({
                    modify: {
                        type: 'task',
                        part: 'projects',
                        id: Number(taskId),
                        key: 'id',
                        data: updatedTask,
                        nestedProperties: ['projects', 'sections', 'tasks']
                    }
                }));

                toast.update(alertId, {
                    render: "Task Updated",
                    type: "success",
                    isLoading: false,
                    ...TOASTIFY_OPTIONS
                });
            }
        } catch (error) {
            setIsSubmitButtonDisabled(false);
            console.log(error);
            toast.update(alertId, {
                render: "Create Task Failed",
                type: "error",
                isLoading: false,
                ...TOASTIFY_OPTIONS
            });
        }
    };

    const onEnterKeyPressed = (e) => e.key === "Enter" ? onSubmitBtnClicked() : null;

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => navigate(-1), REACT_MODAL_OPTIONS.closeTimeoutMS)
    }

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
                <div className="create-new-task-head-wrapper col-12">
                    <input
                        type="text"
                        placeholder="Title"
                        className="title-input col-5"
                        onChange={onTitleChanged}
                        value={taskTitle}
                    />
                    <div className="head-wrapper-separator col-2">
                        <SelectColor
                            isPriorityListOpen={isPriorityListOpen}
                            taskColor={taskColor}
                            setTaskColor={setTaskColor}
                        />
                        <SelectPriority
                            isPriorityListOpen={isPriorityListOpen}
                            setIsPriorityListOpen={setIsPriorityListOpen}
                            taskPriority={taskPriority}
                            setTaskPriority={setTaskPriority}
                        />
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
                <SelectLabels taskLabels={taskLabels} setTaskLabels={setTaskLabels}/>
                {/*<SelectAssignee/>*/}
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
            </div>
        </Modal>
    );
};

export default CreateUpdateTaskModal;
