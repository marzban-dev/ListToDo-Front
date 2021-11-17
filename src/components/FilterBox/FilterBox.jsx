import React from "react";
import "./filterBox.scss";

const ProjectsFilterBox = ({ setViewMode, viewMode }) => {
  return (
    <div className="filter-settings-box col-12">
      <div className="filter-settings-search col-2">
        <button className="col-2">
          <span className="far fa-search"></span>
        </button>
        <input type="text" placeholder="search" className="col-10" />
      </div>
      <div className="filter-settings col-2">
        <div className="filter-settings-sortby">
          <select>
            <option value="x1">option1</option>
            <option value="x2">option2</option>
            <option value="x3">option3</option>
          </select>
        </div>
        <div className="filter-settings-view-mode">
          <button
            onClick={() => setViewMode("list")}
            className={[
              viewMode === "list" ? "filter-settings-view-mode-active" : null,
            ]}
          >
            <span className="far fa-list-ul"></span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={[
              viewMode === "table" ? "filter-settings-view-mode-active" : null,
            ]}
          >
            <span className="far fa-th"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilterBox;
