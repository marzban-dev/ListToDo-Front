import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useCreateSectionQuery, useSectionsQuery} from "hooks/useSectionsData";
import catchAsync from "Utils/CatchAsync";
import {changePosition} from "store/actions/Main.actions";
import PageContainer from "components/UI/PageContainer";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SkeletonLoader from "components/UI/SkeletonLoader";
import CreateInput from "components/CreateInput";
import ShowSections from "components/ShowSections";
import "./tasks.scss";

const Tasks = ({project, subProject}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {data: sections, isLoading} = useSectionsQuery(project?.id, {enabled: !!project});
    const {mutateAsync: createSection} = useCreateSectionQuery(project?.id);
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

    // useEffect(() => {
    //     const fn = async () => {
    //         try {
    //             await dispatch(checkUser());
    //
    //             if (projectInbox && projectInbox.sections === null) {
    //                 const result = await dispatch(fetchSections({project: projectInbox.id}));
    //
    //                 dispatch(setData({
    //                     modify: {
    //                         type: 'project',
    //                         part: 'projects',
    //                         id: projectInbox.id,
    //                         key: 'id',
    //                         data: {sections: result},
    //                         nestedProperties: ['projects']
    //                     }
    //                 }));
    //             }
    //         } catch (error) {
    //             setServerError(true)
    //         }
    //     }
    //     fn();
    // }, []);

    const createSectionHandler = (title) => {
        catchAsync(async () => {
            setIsCreateButtonDisabled(true);
            await createSection({projectId: project?.id, data: {title}});
            setIsCreateButtonDisabled(false);
        }, {
            onLoad: "Creating section",
            onSuccess: "Section created",
            onError: "Creating section failed"
        }, () => setIsCreateButtonDisabled(false))();
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(changePosition('project', 'section', 'sections', project?.id, oldIndex, newIndex, project?.sections));
    }

    return (
        <React.Fragment>
            <PageContainer>
                <LoadingWrapper
                    show={!!project && !!sections}
                    customLoadingComponent={
                        <SkeletonLoader
                            type={'sections'}
                            speed={1}
                            width={1200}
                            height={66}
                            viewBox="0 0 1200 66"
                            style={{marginTop: "3rem"}}
                        />
                    }
                >
                    <div className="sections-container col-12">
                        <CreateInput
                            onClick={createSectionHandler}
                            isDisabled={isCreateButtonDisabled}
                            placeholder="Section name"
                            iconClass="far fa-plus-circle"
                        />
                        {!!sections && <ShowSections onSortEnd={onSortEnd} useDragHandle axis="x" sections={sections}/>}
                    </div>
                </LoadingWrapper>
            </PageContainer>
            <Outlet/>
        </React.Fragment>
    );
};

export default Tasks;