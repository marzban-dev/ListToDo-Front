import React from "react";
import Project from "components/Project/Project";
import { SortableContainer } from "react-sortable-hoc";

const SortableProjectsWrapper = ({ projects }) => {
  const renderProjects = () => {
    return projects.map(({ title }, index) => {
      return <Project key={index} index={index} title={title} />;
    });
  };

  return <div className="projects-list-wrapper">{renderProjects()}</div>;
};

export default SortableContainer(SortableProjectsWrapper);
