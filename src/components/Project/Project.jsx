import React, { useEffect } from "react";
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import "./project.scss";
import FaceImage1 from "../../assets/img/faces/face-1.jpeg";
import FaceImage2 from "../../assets/img/faces/face-2.jpeg";
import FaceImage3 from "../../assets/img/faces/face-3.jpeg";

const Project = ({ title }) => {
  const DragHandle = SortableHandle(() => {
    return (
      <span className="project-head-top-draggable-icon far fa-arrows"></span>
    );
  });

  const progressBarStyle = {
    width: `${50}%`,
  };

  return (
    <section className="project">
      <div className="project-head">
        <div className="project-head-top">
          <div className="project-head-top-info">
            <DragHandle />
            <div className="project-head-top-sections-count">
              <div>
                <span>67</span>
              </div>
              sections
            </div>
            <div className="project-head-top-tasks-count">
              <div>
                <span>67</span>
              </div>
              tasks
            </div>
          </div>
          <div className="project-head-top-priority">
            <span className="fa fa-flag"></span>
          </div>
        </div>
        <div className="project-head-bottom">
          <h3 className="project-head-bottom-title">{title}</h3>
          <p className="project-head-bottom-text">
            <span>67</span>
            sub-project
          </p>
        </div>
      </div>

      <div className="project-body">
        <div className="project-body-prj-progress-container">
          <div className="project-body-prj-progress-days">
            <span>5</span>
            days left
          </div>
          <div className="project-body-prj-progress-bar-container">
            <div className="project-body-prj-progress-bar">
              <div style={progressBarStyle}></div>
            </div>
            <div className="project-body-prj-alarm">
              <span className="project-body-prj-progress-alarm far fa-exclamation-circle"></span>
            </div>
            <div className="project-body-prj-completed-tasks">
              <span>25</span> / <span>67</span>
            </div>
          </div>
        </div>
        <div className="project-body-prj-members">
          <div className="project-body-prj-member">
            <img src={FaceImage1} alt="project-x-member-1" />
          </div>
          <div className="project-body-prj-member">
            <img src={FaceImage2} alt="project-x-member-2" />
          </div>
          <div className="project-body-prj-member">
            <img src={FaceImage3} alt="project-x-member-3" />
          </div>
          <div className="project-body-prj-members-count">
            <span>15</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SortableElement(Project);
