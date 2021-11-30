import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createTask } from "store/actions/Tasks.actions";
import { refreshInboxData } from "store/actions/Inbox.actions";
import SelectLabels from "./ModalSections/SelectLabels";
import SelectPriority from "./ModalSections/SelectPriority";
import SelectAssignee from "./ModalSections/SelectAssignee";
import SelectSchedule from "./ModalSections/SelectSchedule";
import SelectColor from "./ModalSections/SelectColor";
import "./createTaskModal.scss";

export const CreateTaskModal = ({ sectionId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState(1);
  const [taskLabels, setTaskLabels] = useState([]);
  const [taskColor, setTaskColor] = useState("");
  const [taskSchedule, setTaskSchedule] = useState(null);
  const [taskAssignee, setTaskAssignee] = useState(null);

  const [isPriorityListOpen, setIsPriorityListOpen] = useState(false);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

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

  const onModalClosed = () => {
    setIsModalOpen(false);
  };

  const onTitleChanged = (e) => setTaskTitle(e.target.value);
  const onDescriptionChanged = (e) => setTaskDescription(e.target.value);

  const onCreateTaskClicked = async () => {
    setIsCreateButtonDisabled(true);

    const alertId = toast.loading("Creating Task", toastifyOptions);

    try {
      await dispatch(
        createTask(sectionId, {
          title: taskTitle,
          description: taskDescription,
          labels: taskLabels.map((label) => label.id),
          priority: taskPriority,
          color: taskColor,
          assignee: taskAssignee,
          schedule: taskSchedule,
        })
      );

      await dispatch(refreshInboxData());

      setIsCreateButtonDisabled(false);
      toast.update(alertId, {
        render: "Task Created",
        type: "success",
        isLoading: false,
      });
    } catch (error) {
      setIsCreateButtonDisabled(false);
      toast.update(alertId, {
        render: "Create Task Failed",
        type: "error",
        isLoading: false,
      });
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onModalClosed}
      style={{
        overlay: {
          backgroundColor: "#17171796",
        },
      }}
      className="modal-content"
    >
      <div className="create-new-task-modal">
        <div className="create-new-task-head-wrapper col-12">
          <input
            type="text"
            placeholder="Title"
            className="title-input col-5"
            onChange={onTitleChanged}
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
        ></textarea>
        <SelectLabels taskLabels={taskLabels} setTaskLabels={setTaskLabels} />
        <SelectAssignee />
        <div className="create-new-task-save col-12">
          <SelectSchedule
            taskSchedule={taskSchedule}
            setTaskSchedule={setTaskSchedule}
          />
          <button
            className="create-new-task-submit-button col-2"
            onClick={!isCreateButtonDisabled ? onCreateTaskClicked : null}
          >
            <span className="far fa-check"></span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
