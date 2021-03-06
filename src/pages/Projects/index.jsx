import React from "react";
import FloatButton from "components/UI/FloatButton";
import {useQueryClient} from "react-query";
import ShowProjects from "components/ShowProjects";
import LoadingWrapper from "components/UI/LoadingWrapper";
import catchAsync from "utils/CatchAsync";
import {changeListItemPosition} from "utils/ChangeListItemPosition";
import {useChangePositionQuery} from "hooks/useDetailsData";
import EmptySign from "components/UI/EmptySign";
import SkeletonLoader from "components/UI/SkeletonLoader";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAllProjectsQuery} from "hooks/useProjectsData";
import "./projects.scss";

const Projects = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const inboxProject = queryClient.getQueryData('inbox-project');
    const {data: projects} = useAllProjectsQuery(inboxProject.id);
    const {mutateAsync: changePosition} = useChangePositionQuery(['projects', inboxProject.id]);

    // const onSortEnd = ({oldIndex, newIndex}) => {
    //     const returnedItems = arrayMoveImmutable(projects, oldIndex, newIndex);
    //     dispatch(updateProjectPosition(projects[oldIndex].id, newIndex + 1));
    //     dispatch(setProjects(returnedItems));
    // };

    const onSortEnd = ({oldIndex, newIndex}) => {
        catchAsync(async () => {
            const {list, newPosition} = changeListItemPosition(oldIndex, newIndex, projects);
            const itemId = projects[oldIndex].id;
            await changePosition({
                id: itemId,
                newPosition,
                type: "project",
                list
            });
        })();
    }

    const renderProjects = () => {
        return (
            <React.Fragment>
                <div className="projects col-12">
                    <LoadingWrapper show={!!projects} customLoadingComponent={
                        <SkeletonLoader
                            type={"projects"}
                            width={1250}
                            height={250}
                            viewBox="0 0 1250 250"
                        />
                    }>
                        {!!projects && (
                            projects.length !== 0 ? (
                                <ShowProjects
                                    onSortEnd={onSortEnd}
                                    projects={projects}
                                    useDragHandle
                                    axis="xy"
                                    sortable
                                />
                            ) : (
                                <EmptySign text="Yoy doesn't have any project"/>
                            )
                        )}
                    </LoadingWrapper>
                    <FloatButton float="r" iconClass="far fa-plus" onClick={() => {
                        navigate({
                            pathname: `/create-project/${inboxProject.id}`,
                            search: `?bl=${JSON.stringify(location)}`
                        });
                    }}/>
                </div>
                <Outlet/>
            </React.Fragment>
        );
    };

    return renderProjects();
};

export default Projects;
