import React, { useEffect, useState } from "react";
import { arrayMoveImmutable } from "array-move";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Header from "components/Header/Header";
import FilterBox from "components/FilterBox/FilterBox";
import SortableProjectsWrapper from "./SortableProjectsWrapper";
import FloatButton from "components/UI/FloatButton/FloatButton";
import {
  fetchAllProjects,
  setProjects,
  updateProjectPosition,
} from "store/actions/Projects.actions";
import { checkUser } from "store/actions/Auth.actions";
import "./projects.scss";
import Loading from "components/Loading/Loading";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.all);
  const isUserAuthenticate = useSelector((state) => state.auth.user);
  const isProjectsLoading = useSelector((state) => state.projects.isLoading);
  const isUserAuthLoading = useSelector((state) => state.auth.isLoading);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    dispatch(checkUser()).then(() => {
      if (isUserAuthenticate !== null) {
        dispatch(fetchAllProjects());
      }
    });
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const returnedItems = arrayMoveImmutable(projects, oldIndex, newIndex);
    console.log(oldIndex, newIndex);
    dispatch(updateProjectPosition(projects[oldIndex].id, newIndex + 1));
    dispatch(setProjects(returnedItems));
  };

  const renderProjects = () => {
    console.log(isProjectsLoading, isUserAuthLoading);
    if (!isProjectsLoading && !isUserAuthLoading) {
      return (
        <main className="projects col-12">
          <FilterBox viewMode={viewMode} setViewMode={setViewMode} />
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
          <FloatButton float="r" iconClass="far fa-plus" />
        </main>
      );
    } else {
      return <Loading />;
    }
  };

  return (
    <div className="col-10">
      <Header title="Projects" />
      {renderProjects()}
    </div>
  );
};

export default Projects;
