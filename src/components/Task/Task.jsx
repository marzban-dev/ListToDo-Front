import React from "react";
import { useSelector } from "react-redux";
import "./task.scss";

// const DragHandle = SortableHandle(() => {
//   return (
//     <div className="tasks-draggable-icon">
//       <span className="far fa-arrows"></span>
//     </div>
//   );
// });

const Task = ({ title, color }) => {

  const labels = useSelector(state=> state.inbox.labels);

  return (
    <div className="task">
      <div className="task-input" style={{ backgroundColor: color }}>
        {/* <DragHandle /> */}
        <input type="checkbox" id="task-radio-btn" />
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
