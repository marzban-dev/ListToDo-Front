import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import "./createTaskModal.scss";

export const CreateTaskModal = ({ isModalOpen, setIsModalOpen }) => {
  const [priority, setPriority] = useState(1);
  const labels = useSelector((state) => state.inbox.labels);
  const matchedLabels = useState([]);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const onPriorityChanged = (e) => {
    if (e.target.checked) {
      setPriority(Number(e.target.value));
    }
  };

  const selectMatchedLabel = () => {
    return <div className="labels-select-menu"></div>;
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      style={{
        overlay: {
          backgroundColor: "#17171796",
        },
      }}
      className="modal-content"
    >
      <div className="create-new-task-modal">
        <input type="text" placeholder="Title" className="title-input" />
        <textarea
          rows="4"
          placeholder="Description"
          className="description-input"
        ></textarea>
        <div className="labels">
          {matchedLabels.length !== 0 ? selectMatchedLabel : null}
          {labels.map((label, index) => {
            return (
              <li className="labels-item" key={label.id}>
                {label.title}
              </li>
            );
          })}
        </div>
        <div className="new-task-priority">
          <div className="priority-item">
            <input
              type="radio"
              id="radio-x"
              name="r"
              hidden
              value="1"
              onChange={onPriorityChanged}
            />
            <label htmlFor="radio-x">
              <span
                className={[
                  "priority-item-red",
                  priority === 1 ? "fa fa-flag" : "far fa-flag",
                ].join(" ")}
              ></span>
            </label>
          </div>

          <div className="priority-item">
            <input
              type="radio"
              id="radio-y"
              name="r"
              hidden
              value="2"
              onChange={onPriorityChanged}
            />
            <label htmlFor="radio-y">
              <span
                className={[
                  "priority-item-green",
                  priority === 2 ? "fa fa-flag" : "far fa-flag",
                ].join(" ")}
              ></span>
            </label>
          </div>
          <div className="priority-item">
            <input
              type="radio"
              id="radio-z"
              name="r"
              hidden
              value="3"
              onChange={onPriorityChanged}
            />
            <label htmlFor="radio-z">
              <span
                className={[
                  "priority-item-blue",
                  priority === 3 ? "fa fa-flag" : "far fa-flag",
                ].join(" ")}
              ></span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
