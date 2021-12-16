import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {createTask, updateTask} from "store/actions/ApiCalls.actions";
import {setData} from "store/actions/Main.actions";
import SelectLabels from "./ModalSections/SelectLabels";
import SelectPriority from "./ModalSections/SelectPriority";
import SelectAssignee from "./ModalSections/SelectAssignee";
import SelectSchedule from "./ModalSections/SelectSchedule";
import SelectColor from "./ModalSections/SelectColor";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import "./taskModal.scss";

export const CreateUpdateTaskModal = ({mode}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {taskId, sectionId} = useParams();

    const [taskTitle, setTaskTitle] = useState(location.state ? location.state.title : "");
    const [taskDescription, setTaskDescription] = useState(location.state ? location.state.description : "");
    const [taskPriority, setTaskPriority] = useState(location.state ? Number(location.state.priority) : 0);
    const [taskLabels, setTaskLabels] = useState(location.state ? location.state.label : []);
    const [taskColor, setTaskColor] = useState(location.state ? location.state.color : null);
    const [taskSchedule, setTaskSchedule] = useState(location.state ? new Date(location.state.schedule) : null);
    const [taskAssignee] = useState(location.state ? location.state.assignee : null);

    const [isPriorityListOpen, setIsPriorityListOpen] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const toastifyOptions = {
        autoClose: 2000,
        closeOnClick: true,
        position: "top-center",
        pauseOnHover: false,
        hideProgressBar: true,
    };

    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

    const onTitleChanged = (e) => setTaskTitle(e.target.value);
    const onDescriptionChanged = (e) => setTaskDescription(e.target.value);

    const onEnterKeyPressed = (e) => e.key === "Enter" ? onSubmitBtnClicked() : null;
    const onSubmitBtnClicked = async () => {
        setIsSubmitButtonDisabled(true);

        const alertId = toast.loading("Creating Task", toastifyOptions);

        const dataObject = {
            title: taskTitle,
            description: taskDescription,
            labels:
                taskLabels.length !== 0 ? taskLabels.map((label) => label.id) : [],
            priority: taskPriority === 0 ? null : taskPriority,
            color: taskColor,
            assignee: taskAssignee,
            schedule: taskSchedule,
        };

        try {
            if (mode === 'create') {
                const createdTask = await dispatch(createTask(sectionId, dataObject));

                setIsSubmitButtonDisabled(false);

                console.log(createdTask)

                dispatch(setData({
                    modify: {
                        type: 'section',
                        part: 'projects',
                        id: Number(sectionId),
                        key: 'id',
                        data: {tasks: createdTask},
                        nestedProperties: ['projects', 'sections']
                    }
                }));

                toast.update(alertId, {
                    render: "Task Created",
                    type: "success",
                    isLoading: false,
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
                });
            }
        } catch (error) {
            setIsSubmitButtonDisabled(false);
            console.log(error);
            toast.update(alertId, {
                render: "Create Task Failed",
                type: "error",
                isLoading: false,
            });
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => navigate(-1)}
            style={{
                overlay: {
                    backgroundColor: "#17171796",
                },
            }}
            className="modal-content"
            closeTimeoutMS={100}
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
                <textarea
                    rows="4"
                    placeholder="Description"
                    className="description-input"
                    onChange={onDescriptionChanged}
                    value={taskDescription}
                ></textarea>
                <SelectLabels taskLabels={taskLabels} setTaskLabels={setTaskLabels}/>
                <SelectAssignee/>
                <div className="create-new-task-save col-12">
                    <SelectSchedule
                        taskSchedule={taskSchedule}
                        setTaskSchedule={setTaskSchedule}
                    />
                    <button
                        className="create-new-task-submit-button col-2"
                        onClick={!isSubmitButtonDisabled ? onSubmitBtnClicked : null}
                    >
                        <span className="far fa-check"></span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateUpdateTaskModal;
