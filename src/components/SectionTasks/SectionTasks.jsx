import Task from "components/Task/Task";
import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import "./sectionTasks.scss";

const SectionTasks = ({ sectionId, title, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderTasks = () => {
    return tasks.map(({ id, title, color, completed }, index) => {
      return !completed ? (
        <Task key={index} taskId={id} title={title} color={color} />
      ) : null;
    });
  };

  return (
    <div className="section-tasks">
      <div className="section-tasks-head">
        <h3 className="section-tasks-head-title">{title}</h3>
        <div className="section-tasks-head-menu">
          <span className="far fa-ellipsis-v"></span>
        </div>
      </div>

      <section className="section-tasks-list">
        {tasks !== null ? renderTasks() : null}
      </section>

      <div className="section-tasks-add-button">
        <button onClick={() => setIsModalOpen(true)}>
          <span className="far fa-plus"></span>
        </button>
      </div>

      <CreateTaskModal
        sectionId={sectionId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default SectionTasks;
