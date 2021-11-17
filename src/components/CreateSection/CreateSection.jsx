import React, { useRef } from "react";
import "./createSection.scss";

const CreateSection = ({ onClick, inputRef, isRefreshing }) => {
  return (
    <section className="create-section">
      <div className="create-section-input">
        <button className="col-1" onClick={onClick} disabled={isRefreshing}>
          <span className="far fa-plus-circle "></span>
        </button>
        <input
          type="text"
          className="col-11"
          placeholder="Title"
          ref={inputRef}
          onKeyPress={(e) => (e.key === "Enter" ? onClick() : null)}
        />
      </div>
    </section>
  );
};

export default CreateSection;
