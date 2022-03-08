import React from "react";
import SortableProject, {Project} from "components/Project";
import {SortableContainer} from "react-sortable-hoc";
import "./showProjects.scss";
import sortListItems from "utils/SortListItems";

export const ShowProjects = ({projects, secondaryColor, sortable = true}) => {
    return (
        <div className="show-projects-container">
            <div className="projects-list-wrapper">
                {sortListItems(projects).map((project, index) => {
                    if (!project.project.archive) {
                        if (sortable) {
                            return <SortableProject
                                secondaryColor={secondaryColor}
                                key={project.project.id}
                                index={index}
                                project={project}
                            />;
                        } else {
                            return <Project
                                secondaryColor={secondaryColor}
                                key={project.project.id}
                                index={index}
                                project={project}
                                dragHandlerIcon={false}
                            />;
                        }
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    )
};

export default SortableContainer(ShowProjects);