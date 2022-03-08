import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import {useCreateSectionQuery, useSectionsQuery} from "hooks/useSectionsData";
import catchAsync from "utils/CatchAsync";
import PageContainer from "components/UI/PageContainer";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SkeletonLoader from "components/UI/SkeletonLoader";
import CreateInput from "components/CreateInput";
import ShowSections from "components/ShowSections";
import {changeListItemPosition} from "utils/ChangeListItemPosition";
import {useChangePositionQuery} from "hooks/useDetailsData";
import "./tasks.scss";

const Tasks = ({project}) => {
    const {data: sections} = useSectionsQuery(project?.id, {enabled: !!project});
    const {mutateAsync: createSection} = useCreateSectionQuery(project?.id);
    const {mutateAsync: changePosition} = useChangePositionQuery(['project-sections', project.id]);
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);

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
        catchAsync(async () => {
            const {list, newPosition} = changeListItemPosition(oldIndex, newIndex, sections);
            const itemId = sections[oldIndex].id;
            await changePosition({
                id: itemId,
                newPosition,
                type: "section",
                list
            });
        })();
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
                        {!!sections && (
                            <ShowSections onSortEnd={onSortEnd} useDragHandle axis="x" sections={sections}/>
                        )}
                    </div>
                </LoadingWrapper>
            </PageContainer>
            <Outlet/>
        </React.Fragment>
    );
};

export default Tasks;