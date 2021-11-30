import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./selectPriority.scss";

const SelectPriority = ({
  taskPriority,
  setTaskPriority,
  isPriorityListOpen,
  setIsPriorityListOpen,
}) => {
  const priorityList = [
    { id: 1, color: "#dc3545" },
    { id: 2, color: "#198754" },
    { id: 3, color: "#0d6efd" },
    { id: 4, color: "#fd7e14" },
  ];

  const onPriorityChanged = (e) => setTaskPriority(Number(e.target.value));

  const PriorityItem = ({ id, color }) => {
    return (
      <div className="priority-item" key={id}>
        <input
          type="radio"
          id={`priority-input-${id}`}
          hidden
          value={id}
          onChange={onPriorityChanged}
          onClick={() => setIsPriorityListOpen(false)}
        />
        <label htmlFor={`priority-input-${id}`}>
          <span
            style={{
              color: color,
              opacity: taskPriority === id ? 1 : 0.5,
            }}
            className="fa fa-flag"
          ></span>
        </label>
      </div>
    );
  };

  const nodeRef = useRef(null);

  return (
    <div className="new-task-priority col-1">
      <CSSTransition
        in={isPriorityListOpen}
        timeout={500}
        nodeRef={nodeRef}
        classNames={{
          enter: "animate__animated animate__faster",
          enterActive: "animate__fadeIn",
          exit: "animate__animated animate__faster",
          exitActive: "animate__fadeOut",
        }}
        unmountOnExit
      >
        <div className="new-task-priority-list" ref={nodeRef}>
          {priorityList.map(({ id, color }) => (
            <PriorityItem id={id} color={color} />
          ))}
        </div>
      </CSSTransition>
      <button
        className={[
          "new-task-priority-open-list-button",
          isPriorityListOpen ? "priority-list-button-active" : null,
        ].join(" ")}
        onClick={() => setIsPriorityListOpen(!isPriorityListOpen)}
      >
        <span
          className="fa fa-flag"
          style={{
            color:
              priorityList[
                priorityList.findIndex(
                  (priority) => priority.id === taskPriority
                )
              ].color,
          }}
        ></span>
      </button>
    </div>
  );
};

export default SelectPriority;
