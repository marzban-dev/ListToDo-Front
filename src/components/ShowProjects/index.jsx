import React from "react";
import SortableProject, {Project} from "components/Project";
import {SortableContainer} from "react-sortable-hoc";
import "./showProjects.scss";

export const ShowProjects = ({projects, sortable = true}) => {
    return (
        <div className="show-projects-container">
            <div className="projects-list-wrapper">
                {projects.map((project, index) => {
                    if (sortable) {
                        return <SortableProject key={project.id} index={index} project={project}/>;
                    } else {
                        return <Project key={project.id} index={index} project={project} dragHandlerIcon={false}/>;
                    }
                })}
            </div>
        </div>
    )
};

export default SortableContainer(ShowProjects);