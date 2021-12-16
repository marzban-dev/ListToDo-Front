import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {checkUser} from "store/actions/Auth.actions";
import {setData} from "store/actions/Main.actions";
import {createSection, fetchSections} from "store/actions/ApiCalls.actions";
import {toast} from "react-toastify";
import Header from "components/Header/Header";
import FloatButton from "components/UI/FloatButton/FloatButton";
import Loading from "components/Loading/Loading";
import InternalServerError from "components/InternalServerError/InternalServerError";
import SectionTasks from "components/SectionTasks/SectionTasks";
import CreateSection from "components/CreateSection/CreateSection";
import "./tasks.scss";

const Tasks = () => {
    const dispatch = useDispatch();

    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

    const projectInbox = useSelector((state) =>
        state.main.projects.find(prj => prj.position === -1)
    );

    const isRefreshing = useSelector((state) => state.main.isRefreshing);
    const isMainAppLoading = useSelector((state) => state.main.isLoading);

    const isUserAuthLoading = useSelector((state) => state.auth.isLoading);

    const [serverError, setServerError] = useState(false);

    useEffect(() => {
        console.log('render')
        async function fn() {
            try {
                await dispatch(checkUser());

                if (projectInbox.sections === null) {
                    const result = await dispatch(fetchSections({project: projectInbox.id}));

                    dispatch(setData({
                        modify: {
                            type: 'project',
                            part: 'projects',
                            id: projectInbox.id,
                            key: 'id',
                            data: {sections: result},
                            nestedProperties: ['projects']
                        }
                    }));
                }
            } catch (error) {
                console.log(error)
                setServerError(true);
            }
        }

        fn();
    }, []);

    const sectionTitleInputRef = useRef(null);

    const toastifyOptions = {
        autoClose: 2000,
        closeOnClick: true,
        position: "top-center",
        pauseOnHover: false,
        hideProgressBar: true,
    };

    const onClickHandler = async () => {
        setIsCreateButtonDisabled(true);

        const alertId = toast.loading("Creating Section", toastifyOptions);

        try {
            const createdSection = await dispatch(
                createSection(projectInbox.id, {
                    title: sectionTitleInputRef.current.value,
                })
            );

            dispatch(setData({
                modify: {
                    type: 'project',
                    part: 'projects',
                    id: projectInbox.id,
                    key: 'id',
                    data: {sections: createdSection},
                    nestedProperties: ['projects']
                }
            }));

            toast.update(alertId, {
                render: "Section Created",
                type: "success",
                isLoading: false,
            });
        } catch (error) {
            console.log(error)
            toast.update(alertId, {
                render: "Create Section Failed",
                type: "error",
                isLoading: false,
            });
        }
    };

    const renderSectionTasks = () => {
        if (!isMainAppLoading && !isUserAuthLoading) {
            if (!serverError) {
                return (
                    <main className="sections-container col-12">
                        <CreateSection
                            onClick={!isRefreshing ? onClickHandler : null}
                            inputRef={sectionTitleInputRef}
                            disabled={isCreateButtonDisabled}
                        />
                        <section className="sections">
                            {projectInbox.sections ? projectInbox.sections.map((section) => {
                                return <SectionTasks key={section.id} section={section}/>
                            }) : "loading"}
                        </section>
                        <FloatButton float="r" iconClass="far fa-plus"/>
                    </main>
                );
            } else {
                return <InternalServerError/>;
            }
        } else {
            return <Loading/>;
        }
    };

    return (
        <div className="col-10">
            <Header title="Tasks"/>
            {renderSectionTasks()}
            <Outlet/>
        </div>
    );
};

export default Tasks;
