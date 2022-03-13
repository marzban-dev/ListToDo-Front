import React, {useState} from "react";
import {useProjectsQuery} from "hooks/useProjectsData";
import Tasks from "pages/Tasks";
import ShowProjects from "components/ShowProjects";
import LoadingWrapper from "components/UI/LoadingWrapper";
import FloatButton from "components/UI/FloatButton";
import AnimateComponent from "components/UI/AnimateComponent";
import ShowComments from "components/ShowComments";
import SkeletonLoader from "components/UI/SkeletonLoader";
import EmptySign from "components/UI/EmptySign";
import {useLocation, useNavigate} from "react-router-dom";
import {useQueryClient} from "react-query";
import "./projectBody.scss";

const ProjectBody = ({project}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [tabState, setTabState] = useState("p");
    const {data: subProjects} = useProjectsQuery(project.id);
    const user = queryClient.getQueryData('user');

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

                <button
                    className={tabState === "c" ? "project-body-tab-active" : null}
                    onClick={() => setTabState('c')}
                >
                    Comments
                </button>
            </div>
            <div className="project-body-content-wrapper">
                {tabState === "s" && <Tasks project={project} subProject/>}
                {tabState === "p" && (
                    <React.Fragment>
                        <AnimateComponent>
                            <LoadingWrapper
                                show={!!subProjects} customLoadingComponent={
                                <SkeletonLoader
                                    type={"projects"}
                                    width={1250}
                                    height={250}
                                    viewBox="0 0 1250 250"
                                    style={{marginLeft: "24px"}}
                                />
                            }>
                                {!!subProjects && (
                                    subProjects.length !== 0 ? (
                                        <ShowProjects
                                            projects={subProjects}
                                            onSortEnd={() => {
                                            }}
                                            useDragHandle
                                            axis="xy"
                                        />
                                    ) : (
                                        <EmptySign text="Yoy doesn't have any project"/>
                                    )
                                )}
                            </LoadingWrapper>
                        </AnimateComponent>
                        {user.id === project.owner.id && (
                            <FloatButton float="r" iconClass="far fa-plus" onClick={() => {
                                navigate(`/create-project/${project.id}`, {state: {backgroundLocation: location}})
                            }}/>
                        )}
                    </React.Fragment>
                )}
                {tabState === "c" && (
                    <AnimateComponent>
                        <ShowComments id={project.id}/>
                    </AnimateComponent>
                )}
            </div>
        </div>
    );
}

export default ProjectBody;