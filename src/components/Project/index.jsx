import React from "react";
import {SortableElement, SortableHandle} from "react-sortable-hoc";
import ScheduleProgressBar from "components/ScheduleProgressBar";
import {useNavigate} from "react-router-dom";
import Members from "components/Members";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import "./project.scss";

export const Project = ({project: {project, background, color}, dragHandlerIcon = true}) => {
    const navigate = useNavigate();

    const DragHandle = SortableHandle(() => {
        return (
            <span className="project-head-top-draggable-icon far fa-arrows"></span>
        );
    });

    return (
        <section
            className="project"
            onClick={() => navigate(`/project/${project.id}/${project.project}`)}
            style={color ? {backgroundColor: `var(--color-${color})`} : null}
        >
            <div className="project-head">
                {background && <ProfileWallpaper
                    wallpaperPicture={background}
                    className="project-head-background"
                    darkLayerOpacity={0.4}
                />}
                <div className="project-head-top">
                    <div className="project-head-top-info">
                        {dragHandlerIcon && <DragHandle/>}
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
                </div>
                <div className="project-head-bottom">
                    <h3 className="project-head-bottom-title">{project.title}</h3>
                    <p className="project-head-bottom-text">
                        <span>67</span>
                        sub-project
                    </p>
                </div>
            </div>

            <div className="project-body">
                {project.schedule ?
                    <ScheduleProgressBar createdTime={project.created} deadTime={project.schedule}/> : null}
                <ScheduleProgressBar createdTime={project.created}
                                     deadTime={'Sun Feb 06 2022 13:59:24 GMT+0330 (Iran Standard Time)'}/>

                <Members compressed limit={3} members={project.users}/>
            </div>
        </section>
    );
};

export default SortableElement(Project);
