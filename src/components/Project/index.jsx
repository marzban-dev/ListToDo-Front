import React from "react";
import {SortableElement, SortableHandle} from "react-sortable-hoc";
import ScheduleProgressBar from "components/ScheduleProgressBar";
import {useNavigate} from "react-router-dom";
import Members from "components/Members";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import "./project.scss";

export const Project = ({project: {project, background, color}, secondaryColor, dragHandlerIcon = true}) => {
    const navigate = useNavigate();

    const DragHandle = SortableHandle(() => {
        return (
            <span className="project-head-top-draggable-icon far fa-arrows"></span>
        );
    });

    return (
        <section
            onClick={() => navigate(`/project/${project.id}/${project.project}`)}
            style={color ? {backgroundColor: `var(--color-${color})`} : null}
            className={["project", color ? `project-bg-color-${color}` : null, secondaryColor ? "project-color-secondary" : null].join(' ')}
        >
            <div className={["project-head", secondaryColor ? "project-color-secondary" : null].join(' ')}>
                {background && (
                    <ProfileWallpaper
                        wallpaperPicture={background}
                        className="project-head-background"
                        darkLayerOpacity={0.4}
                    />
                )}
                <div className="project-head-top">
                    <div className="project-head-top-info">
                        {dragHandlerIcon && <DragHandle/>}
                        <div
                            className={["project-head-top-sections-count", secondaryColor ? "project-badge-color-secondary" : null].join(' ')}>
                            <div><span>{project.count_section}</span></div>
                            Sections
                        </div>
                        <div
                            className={["project-head-top-tasks-count", secondaryColor ? "project-badge-color-secondary" : null].join(' ')}>
                            <div><span>{project.count_tasks}</span></div>
                            Tasks
                        </div>
                    </div>
                </div>
                <div className="project-head-bottom">
                    <h3 className="project-head-bottom-title">{project.title}</h3>
                    <p className="project-head-bottom-text">
                        <span>{project.count_subprojects}</span>Sub Projects
                    </p>
                </div>
            </div>

            <div className="project-body" style={{justifyContent: project.schedule ? "space-between" : "flex-end"}}>
                {project.schedule ?
                    <ScheduleProgressBar createdTime={project.created} deadTime={project.schedule} width={180}/> : null}
                <Members compressed limit={3} gap={18} members={project.users}/>
            </div>
        </section>
    );
};

export default SortableElement(Project);
