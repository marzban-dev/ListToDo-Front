import React, {useState} from "react";
import {arrayMoveImmutable} from "array-move";
import {setProjects, updateProjectPosition} from "store/actions/Projects.actions";
import FloatButton from "components/UI/FloatButton";
import PageContainer from "components/UI/PageContainer";
import {useQueryClient} from "react-query";
import {useDispatch} from "react-redux";
import ShowProjects from "components/ShowProjects";
import LoadingWrapper from "components/UI/LoadingWrapper";
import "./projects.scss";

const Projects = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState('table');
    const inboxProject = queryClient.getQueryData('inbox-project');
    const projects = queryClient.getQueryData(['projects', inboxProject?.id]);

    const onSortEnd = ({oldIndex, newIndex}) => {
        const returnedItems = arrayMoveImmutable(projects, oldIndex, newIndex);
        dispatch(updateProjectPosition(projects[oldIndex].id, newIndex + 1));
        dispatch(setProjects(returnedItems));
    };

    const renderProjects = () => {
        return (

                <PageContainer widthPadding>
                    <div className="projects col-12">
                        <LoadingWrapper show={!!projects} type="circle" size="lg">
                            {projects && (
                                <ShowProjects
                                    onSortEnd={onSortEnd}
                                    projects={projects}
                                    useDragHandle
                                    axis="xy"
                                />
                            )}
                        </LoadingWrapper>
                        <FloatButton float="r" iconClass="far fa-plus" onClick={() => alert('New Project')}/>
                    </div>
                </PageContainer>

        );
    };

    return (renderProjects());
};

export default Projects;
