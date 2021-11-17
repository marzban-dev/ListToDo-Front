import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "store/actions/Auth.actions";
import { fetchInboxData, refreshInboxData } from "store/actions/Inbox.actions";
import { createSection } from "store/actions/Tasks.actions";
import { toast } from "react-toastify";
import Header from "components/Header/Header";
import FloatButton from "components/UI/FloatButton/FloatButton";
import Loading from "components/Loading/Loading";
import InternalServerError from "components/InternalServerError/InternalServerError";
import SectionTasks from "components/SectionTasks/SectionTasks";
import CreateSection from "components/CreateSection/CreateSection";
import axios from "AxiosInstance";
import "./tasks.scss";

const Tasks = () => {
  const dispatch = useDispatch();

  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

  const sections = useSelector((state) => state.inbox.sections);
  const inboxProject = useSelector((state) => state.inbox.project);
  const isRefreshing = useSelector((state) => state.inbox.isRefreshing);
  const isInboxLoading = useSelector((state) => state.inbox.isLoading);

  const isUserAuthenticate = useSelector((state) => state.auth.user);
  const isUserAuthLoading = useSelector((state) => state.auth.isLoading);

  const [serverError, setServerError] = useState(false);

  const toastifyOptions = {
    autoClose: 2000,
    closeOnClick: true,
    position: "top-center",
    pauseOnHover: false,
    hideProgressBar: true,
  };

  useEffect(() => {
    dispatch(checkUser()).then(() => {
      if (isUserAuthenticate !== null) {
        dispatch(fetchInboxData()).catch((err) => setServerError(true));
      }
    });
  }, []);

  const sectionTitleInputRef = useRef(null);

  const onClickHandler = () => {
    setIsCreateButtonDisabled(true);
    dispatch(
      createSection(inboxProject.id, {
        title: sectionTitleInputRef.current.value,
      })
    )
      .then(() => {
        toast.promise(
          dispatch(refreshInboxData()),
          {
            success: "Section Created",
            error: "Create Section Failed",
            pending: "Creating Section",
          },
          toastifyOptions
        );
      })
      .catch((err) => toast.error("Create Section Failed", toastifyOptions));
  };

  const renderSectionTasks = () => {
    if (!isInboxLoading && !isUserAuthLoading) {
      if (!serverError) {
        return (
          <main className="sections-container col-12">
            <CreateSection
              onClick={!isRefreshing ? onClickHandler : null}
              inputRef={sectionTitleInputRef}
              disabled={isCreateButtonDisabled}
            />
            <section className="sections">
              {Object.keys(sections).map((section) => {
                return (
                  <SectionTasks title={section} tasks={sections[section]} />
                );
              })}
            </section>

            <FloatButton float="r" iconClass="far fa-plus" />
          </main>
        );
      } else {
        return <InternalServerError />;
      }
    } else {
      return <Loading />;
    }
  };

  return (
    <div className="col-10">
      <Header title="Tasks" />
      {renderSectionTasks()}
    </div>
  );
};

export default Tasks;
