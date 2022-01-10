import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {checkUser} from "store/actions/Auth.actions";
import {setData} from "store/actions/Main.actions";
import {createSection, fetchSections} from "store/actions/ApiCalls.actions";
import {toast} from "react-toastify";
import LoadingScreen from "components/UI/LoadingScreen/LoadingScreen";
import InternalServerError from "components/InternalServerError/InternalServerError";
import SectionTasks from "components/SectionTasks/SectionTasks";
import CreateSection from "components/CreateSection/CreateSection";
import PageContainer from "components/UI/PageContainer";
import SkeletonLoader from "components/UI/SkeletonLoader/SkeletonLoader";
import {TOASTIFY_OPTIONS} from "config";
import "./tasks.scss";

const Tasks = () => {
    const dispatch = useDispatch();

    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

    const projectInbox = useSelector((state) =>
        state.main.projects.find(prj => prj.position === -1)
    );

    const isMainAppLoading = useSelector((state) => state.main.isLoading);

    const isUserAuthLoading = useSelector((state) => state.auth.isLoading);

    const [serverError, setServerError] = useState(false);

    useEffect(() => {
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

    const CreateSectionHandler = async () => {
        setIsCreateButtonDisabled(true);

        const alertId = toast.loading("Creating Section", TOASTIFY_OPTIONS);

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

            setIsCreateButtonDisabled(false);

            toast.update(alertId, {
                render: "Section Created",
                type: "success",
                isLoading: false,
                ...TOASTIFY_OPTIONS
            });
        } catch (error) {
            setIsCreateButtonDisabled(false);
            toast.update(alertId, {
                render: "Create Section Failed",
                type: "error",
                isLoading: false,
                ...TOASTIFY_OPTIONS
            });
        }
    };

    const [sh, setSh] = useState(false);

    const renderSectionTasks = () => {
        if (!isMainAppLoading && !isUserAuthLoading) {
            if (!serverError) {
                return (
                    <PageContainer>
                        {projectInbox.sections ? <div className="sections-container col-12">
                            <CreateSection
                                onClick={CreateSectionHandler}
                                inputRef={sectionTitleInputRef}
                                isDisabled={isCreateButtonDisabled}
                            />
                            <section className="sections">
                                {projectInbox.sections.map((section) => {
                                    return <SectionTasks key={section.id} section={section}/>
                                })}
                            </section>
                        </div> : <SkeletonLoader
                            type={'sections'}
                            speed={1}
                            width={1200}
                            height={66}
                            viewBox="0 0 1200 66"
                            style={{marginTop: "3rem"}}
                        />}
                    </PageContainer>
                );
            } else {
                return <InternalServerError/>;
            }
        } else {
            return <LoadingScreen/>;
        }
    };

    return (
        <React.Fragment>
            {renderSectionTasks()}
            <Outlet/>
        </React.Fragment>
    );
};

export default Tasks;