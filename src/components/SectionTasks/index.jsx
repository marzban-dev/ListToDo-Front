import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {SortableElement} from "react-sortable-hoc";
import SkeletonLoader from "components/UI/SkeletonLoader";
import Button from "components/UI/Button";
import DragHandler from "components/UI/DragHandler";
import catchAsync from "utils/CatchAsync";
import {useTasksQuery} from "hooks/useTasksData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import ShowTasks from "components/ShowTasks";
import {useDeleteSectionQuery, useUpdateSectionQuery} from "hooks/useSectionsData";
import SelectMenu from "components/UI/SelectMenu";
import "./sectionTasks.scss";

export const SectionTasks = ({section}) => {
        const navigate = useNavigate();
        const location = useLocation();
        const {data: tasks} = useTasksQuery(section.id);
        const {mutateAsync: updateSection} = useUpdateSectionQuery(section.id, section.project.id);
        const {mutateAsync: deleteSection} = useDeleteSectionQuery(section.project.id);

        const onSortEnd = ({oldIndex, newIndex}) => {
            // changePosition('section', 'task', 'tasks', section.id, oldIndex, newIndex, section.tasks)
        };

        const deleteSectionHandler = catchAsync(async () => {
            await deleteSection(section.id);
        }, {
            onLoad: `Deleting section ${section.title}`,
            onSuccess: `Section ${section.title} deleted`,
            onError: `Delete section ${section.title} failed`
        });

        const onEnterKeyPressed = (e) => e.key === "Enter" ? updateSectionHandler() : null;

        const [isSectionEditable, setIsSectionEditable] = useState(false);
        const [sectionTitle, setSectionTitle] = useState(section.title);
        const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

        const updateSectionHandler = catchAsync(async () => {
            setIsSubmitButtonDisabled(true);
            await updateSection({id: section.id, data: {title: sectionTitle}});
            setIsSectionEditable(false);
            setIsSubmitButtonDisabled(false);
        }, {
            onLoad: `Updating section ${section.title}`,
            onSuccess: `Section ${section.title} updated`,
            onError: `Update section ${section.title} failed`
        });

        const archiveSection = catchAsync(async () => {
            await updateSection({id: section.id, data: {archive: true}});
        }, {
            onLoad: `Archiving section ${section.title}`,
            onSuccess: `Section ${section.title} archived`,
            onError: `Archive section ${section.title} failed`
        });

        const onSectionTitleEditInputChanged = (e) => setSectionTitle(e.target.value);

        const selectMenuOptions = [
            {
                iconClass: "far fa-pen",
                text: "Edit",
                action: () => {
                    setIsSectionEditable(true);
                    requestAnimationFrame(() => {
                        const inp = document.querySelector("#edit-title-input");
                        inp.focus();
                    });
                }
            },
            {
                iconClass: "far fa-archive",
                text: "Archive",
                action: archiveSection
            },
            {
                iconClass: "far fa-trash-alt",
                text: "Delete",
                action: deleteSectionHandler,
                yesNoQAlert: "Are you sure to delete this section ?",
                color: "danger"
            }
        ]

        return (
            <div className="section-tasks">
                <div className="section-tasks-head">
                    <div className="section-tasks-head-title">
                        <DragHandler/>
                        {isSectionEditable ? (
                            <div className="section-title-input">
                                <input
                                    type="text"
                                    value={sectionTitle}
                                    onChange={onSectionTitleEditInputChanged}
                                    onKeyPress={!isSubmitButtonDisabled ? onEnterKeyPressed : null}
                                    id="edit-title-input"
                                    onBlur={() => setIsSectionEditable(false)}
                                />
                                <button onClick={updateSectionHandler}><span className="far fa-check"></span></button>
                            </div>
                        ) : <h3 className="section-title">{section.title}</h3>}
                    </div>
                    <SelectMenu buttonAxis="v" options={selectMenuOptions} type="executable-options" style={{
                        marginTop: "2px"
                    }}/>
                </div>

                <LoadingWrapper
                    show={!!tasks}
                    customLoadingComponent={
                        <SkeletonLoader
                            type={'tasks'}
                            speed={1}
                            width={350}
                            height={260}
                            viewBox="0 0 350 260"
                        />
                    }
                >
                    {!!tasks && <ShowTasks tasks={tasks} onSortEnd={onSortEnd} useDragHandle axis="y" sortable/>}
                    <div className="section-tasks-list-add-button">
                        <Button
                            iconClass="far fa-plus"
                            onClick={() => {
                                navigate({
                                    pathname: `/create-task/${section.id}/${section.id}/${section.project.id}`,
                                    search: `?bl=${JSON.stringify(location)}&isSubTask=false`
                                });
                            }}
                            style={{marginTop: '1rem'}}
                            size="sm"
                            circleShape
                        />
                    </div>
                </LoadingWrapper>
            </div>
        );
    }
;

export default SortableElement(SectionTasks);
