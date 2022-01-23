import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {checkUser} from "store/actions/Auth.actions";
import {changePosition, setData} from "store/actions/Main.actions";
import {createSection, fetchSections} from "store/actions/ApiCalls.actions";
import LoadingScreen from "components/UI/LoadingScreen";
import InternalServerError from "components/InternalServerError";
import SectionTasks from "components/SectionTasks";
import CreateInput from "components/CreateInput";
import PageContainer from "components/UI/PageContainer";
import SkeletonLoader from "components/UI/SkeletonLoader";
import {SortableContainer} from "react-sortable-hoc";
import {produce} from "immer";
import catchAsync from "Utils/CatchAsync";
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
        const fn = async () => {
            try {
                await dispatch(checkUser());

                if (projectInbox && projectInbox.sections === null) {
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
                setServerError(true)
            }
        }
        fn();
    }, []);

    const CreateSectionHandler = (title) => {
        catchAsync(async () => {
            setIsCreateButtonDisabled(true);

            const createdSection = await dispatch(
                createSection(projectInbox.id, {
                    title,
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

        }, {
            onLoad: "Creating section",
            onSuccess: "Section created",
            onError: "Creating section failed"
        }, () => setIsCreateButtonDisabled(false))();
    }

    /**
     * This function is call every time when task lists change (react-sortable-hoc).
     */

    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(changePosition('project', 'section', 'sections', projectInbox.id, oldIndex, newIndex, projectInbox.sections));
    }

    const RenderSections = SortableContainer(() => {

        // Sort sections list by position.
        const sortedSections = () => {
            return produce(projectInbox.sections, draft => {
                draft.sort((a, b) => a.position > b.position)
            }).map((section, index) => {
                return <SectionTasks key={index} index={index} section={section}/>
            });
        }

        return (
            <section className="sections">
                {sortedSections()}
            </section>
        )
    });


    const renderSectionTasks = () => {
        if (!isMainAppLoading && !isUserAuthLoading) {
            if (!serverError) {
                return (
                    <PageContainer>
                        {projectInbox && projectInbox.sections ? <div className="sections-container col-12">
                            <CreateInput
                                onClick={CreateSectionHandler}
                                isDisabled={isCreateButtonDisabled}
                                placeholder="Section name"
                                iconClass="far fa-plus-circle"
                            />
                            <RenderSections onSortEnd={onSortEnd} useDragHandle axis="x"/>
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