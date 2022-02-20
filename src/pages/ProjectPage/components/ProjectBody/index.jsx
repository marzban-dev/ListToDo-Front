import React, {useState} from "react";
import {useProjectsQuery} from "hooks/useProjectsData";
import Tasks from "pages/Tasks";
import ShowProjects from "components/ShowProjects";
import LoadingWrapper from "components/UI/LoadingWrapper";
import FloatButton from "components/UI/FloatButton";
import AnimatedPage from "components/UI/AnimatedPage";
import "./projectBody.scss";

const ProjectBody = ({project}) => {
    const [tabState, setTabState] = useState("p");
    const {data: subProjects, isLoading: isSubProjectsLoading} = useProjectsQuery(project.id);

    return (
        <div className="project-body-container">
            <div className="project-body-tabs">
                <button
                    className={tabState === "p" ? "project-body-tab-active" : null}
                    onClick={() => setTabState('p')}
                >
                    Projects
                </button>

                <button
                    className={tabState === "s" ? "project-body-tab-active" : null}
                    onClick={() => setTabState('s')}
                >
                    Sections
                </button>
            </div>
            <div className="project-body-content-wrapper">
                {tabState === "s" && <Tasks project={project} subProject/>}
                {tabState === "p" && (
                    <React.Fragment>
                        <AnimatedPage>
                            <LoadingWrapper show={!isSubProjectsLoading} type="circle" size="lg">
                                {!!subProjects && (
                                    <ShowProjects
                                        projects={subProjects}
                                        onSortEnd={() => {
                                        }}
                                        useDragHandle
                                        axis="xy"
                                    />
                                )}
                            </LoadingWrapper>
                        </AnimatedPage>
                        <FloatButton float="r" iconClass="far fa-plus" onClick={() => alert('New Project')}/>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}

export default ProjectBody;