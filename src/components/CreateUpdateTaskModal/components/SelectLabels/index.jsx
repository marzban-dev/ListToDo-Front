import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import "./selectLabels.scss";

const SelectLabels = ({ taskLabels, setTaskLabels }) => {
  const [matchedLabels, setMatchedLabels] = useState([]);
  const [isMatchedLabelsListOpen, setIsMatchedLabelsListOpen] = useState(false);
  const labels = useSelector((state) => state.main.labels);

  const SelectedLabels = () => {
    return taskLabels.length !== 0 ? (
      <ul className="labels-selected">
        {taskLabels.map((label) => {
          return (
            <li
              className="labels-selected-item"
              key={label.id}
              style={{ padding: "0.25rem" }}
              onClick={(e) => removeSelectedLabel(label.id)}
            >
              <span className="far fa-tag"></span>
              <span className="labels-selected-item-title">{label.title}</span>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="no-label-selected">No label selected</p>
    );
  };

  const SelectMatchedLabel = () => {
    const addSelectedLabel = (e) => {
      const selectedLabelId = Number(e.target.getAttribute("data-label-id"));

      const selectedLabelsId =
        taskLabels.length !== 0 ? taskLabels.map((label) => label.id) : [];

      if (!selectedLabelsId.includes(selectedLabelId)) {
        const lbl = labels.find((label) => label.id === selectedLabelId);
        setTaskLabels((state) => [...state, lbl]);
      }
    };

    const renderLabels = () => {
      let filteredLabels = [];

      matchedLabels.forEach((matchedLabel) => {
        const labelIndex = labels.findIndex(
          (label) => label.id === matchedLabel.id
        );

        filteredLabels.push(labels[labelIndex]);
      });

      return filteredLabels.length !== 0 ? (
        filteredLabels.map((label) => {
          return (
            <li
              onClick={addSelectedLabel}
              data-label-id={label.id}
              key={label.id}
            >
              {label.title}
            </li>
          );
        })
      ) : (
        <div className="labels-select-menu-no-match-found">
          No label found,create that ?
        </div>
      );
    };

    const nodeRef = useRef(null);

    return (
      <CSSTransition
        classNames="labels-list-fade"
        in={isMatchedLabelsListOpen}
        timeout={500}
        nodeRef={nodeRef}
        unmountOnExit
      >
        <ul ref={nodeRef} className="labels-select-menu">
          {renderLabels()}
        </ul>
      </CSSTransition>
    );
  };

  const onLabelInputChange = (e) => {
    setMatchedLabels([]);
    setIsMatchedLabelsListOpen(true);

    if (e.target.value.length !== 0) {
      const filteredLabels = labels.filter((label) =>
        label.title.toLowerCase().includes(e.target.value)
      );
      setMatchedLabels(filteredLabels);
    } else {
      setMatchedLabels(labels);
      setIsMatchedLabelsListOpen(false);
    }
  };

  const removeSelectedLabel = (id) => {
    const labelIndex = taskLabels.findIndex((label) => label.id === id);
    setTaskLabels((state) =>
      state.filter((label, index) => index !== labelIndex)
    );
  };

  return (
    <div className="labels">
      {SelectMatchedLabel()}
      <div className="labels-input">
        <span className="far fa-tags"></span>
        <input
          type="text"
          onChange={onLabelInputChange}
          placeholder="Search or create label"
        />
        <button
          onClick={() => setIsMatchedLabelsListOpen(!isMatchedLabelsListOpen)}
        >
          <span
            className="far fa-angle-left"
            style={{
              transform: isMatchedLabelsListOpen ? "rotateZ(90deg)" : null,
            }}
          ></span>
        </button>
      </div>
      <SelectedLabels />
    </div>
  );
};

export default SelectLabels;
