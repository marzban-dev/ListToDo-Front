import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "store/actions/Tasks.actions";
import { toast } from "react-toastify";
import "./task.scss";
import { refreshInboxData } from "store/actions/Inbox.actions";

// const DragHandle = SortableHandle(() => {
//   return (
//     <div className="tasks-draggable-icon">
//       <span className="far fa-arrows"></span>
//     </div>
//   );
// });

const Task = ({ taskId, title, color }) => {
  const dispatch = useDispatch();
  const [isTaskChecked, setIsTaskChecked] = useState(false);

  const toastifyOptions = {
    autoClose: 2000,
    closeOnClick: true,
    position: "top-center",
    pauseOnHover: false,
    hideProgressBar: true,
  };

  const onCheckBoxChanged = async (e) => {
    setIsTaskChecked(true);

    try {
      await dispatch(updateTask(taskId, { completed: true }));
      toast.success("Task Updated", toastifyOptions);
    } catch (error) {
      setIsTaskChecked(false);
      toast.error("Update Task Failed", toastifyOptions);
    }
  };

  return (
    <div className="task">
      <div className="task-input" style={{ backgroundColor: color }}>
        {/* <DragHandle /> */}
        <input
          type="checkbox"
          id="task-radio-btn"
          onChange={onCheckBoxChanged}
          disabled={isTaskChecked}
        />
        <label htmlFor="task-radio-btn">{title}</label>
      </div>
      <div className="task-info">
        <div className="task-info-comments">
          <span className="far fa-comment"></span>
          <span className="comments-count">5</span>
        </div>
        <div className="task-info-sub-tasks">
          <span className="far fa-code-merge"></span>
          <span className="sub-tasks-count">2</span>
        </div>
        <div className="task-info-priority">
          <span className="fa fa-flag"></span>
        </div>
      </div>
    </div>
  );
};

export default Task;
