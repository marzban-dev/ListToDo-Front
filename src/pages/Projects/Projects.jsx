import React, {useEffect, useState} from "react";
import {arrayMoveImmutable} from "array-move";
import {useDispatch, useSelector} from "react-redux";
import {checkUser} from "store/actions/Auth.actions";
import {fetchAllProjects, setProjects, updateProjectPosition,} from "store/actions/Projects.actions";
import Header from "components/Header/Header";
import FilterBox from "components/FilterBox/FilterBox";
import SortableProjectsWrapper from "./SortableProjectsWrapper";
import FloatButton from "components/UI/FloatButton/FloatButton";
import LoadingScreen from "components/UI/LoadingScreen/LoadingScreen";
import "./projects.scss";
import PageContainer from "../../components/UI/PageContainer";

const Projects = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.all);
    const isProjectsLoading = useSelector((state) => state.projects.isLoading);
    const isUserAuthLoading = useSelector((state) => state.auth.isLoading);
    const [viewMode, setViewMode] = useState("table");

    useEffect(() => {
        const fn = async () => {
            try {
                await dispatch(checkUser())
                await dispatch(fetchAllProjects());
            } catch (error) {
                console.log(error);
            }
        };
        fn();
    }, []);

    const onSortEnd = ({oldIndex, newIndex}) => {
        const returnedItems = arrayMoveImmutable(projects, oldIndex, newIndex);
        console.log(oldIndex, newIndex);
        dispatch(updateProjectPosition(projects[oldIndex].id, newIndex + 1));
        dispatch(setProjects(returnedItems));
    };

    const renderProjects = () => {
        console.log(isProjectsLoading, isUserAuthLoading);
        if (!isProjectsLoading && !isUserAuthLoading) {
            return (
                <PageContainer widthPadding>
                    <div className="projects col-12">
                        <FilterBox viewMode={viewMode} setViewMode={setViewMode}/>
                        <div className="projects-list">
                            {projects !== null ? (
                                <SortableProjectsWrapper
                                    onSortEnd={onSortEnd}
                                    projects={projects}
                                    useDragHandle
                                    axis="xy"
                                />
                            ) : null}
                        </div>
                        <FloatButton float="r" iconClass="far fa-plus"/>
                    </div>
                </PageContainer>
            );
        } else {
            return <LoadingScreen/>;
        }
    };

    return (renderProjects());
};

export default Projects;
