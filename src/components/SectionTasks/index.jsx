import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import Task from "components/Task";
import {deleteSection, fetchTasks, updateSection} from "store/actions/ApiCalls.actions";
import {changePosition, setData} from "store/actions/Main.actions";
import SkeletonLoader from "components/UI/SkeletonLoader";
import Button from "components/UI/Button";
import DragHandler from "components/UI/DragHandler";
import "./sectionTasks.scss";
import catchAsync from "Utils/CatchAsync";

const SectionTasks = ({section}) => {
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            const fn = async () => {
                try {
                    if (section.tasks === null) {
                        const result = await dispatch(fetchTasks({section: section.id, task__isnull: true}));
                        dispatch(setData({
                            modify: {
                                type: 'section',
                                part: 'projects',
                                id: section.id,
                                key: 'id',
                                data: {tasks: result},
                                nestedProperties: ['projects', 'sections']
                            }
                        }));
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fn();
        }, []);

        const RenderTasks = SortableContainer(() => {
            // Sort tasks list by position.
            const sortedTasksList = () => {
                return section.tasks.map((task, index) => {
                    return !task.completed ? <Task key={index} index={index} task={task}/> : null;
                });
            }

            if (section.tasks) {
                return <React.Fragment>
                    <section className="section-tasks-list">
                        {sortedTasksList()}
                    </section>
                    <div className="section-tasks-list-add-button">
                        <Button
                            iconClass="far fa-plus"
                            onClick={() => navigate(`/tasks/create`, {state: {sectionId: section.id}})}
                            style={{marginTop: '1rem'}}
                            size="sm"
                            circleShape
                        />
                    </div>
                </React.Fragment>
            } else {
                return <SkeletonLoader
                    type={'tasks'}
                    speed={1}
                    width={350}
                    height={260}
                    viewBox="0 0 350 260"
                />
            }
        })

        /**
         * This function is call every time when task lists change (react-sortable-hoc).
         */

        const onSortEnd = ({oldIndex, newIndex}) => dispatch(
            changePosition('section', 'task', 'tasks', section.id, oldIndex, newIndex, section.tasks)
        );

        // const Undo = ({onUndo, closeToast}) => {
        //     const handleClick = () => {
        //         onUndo();
        //         closeToast();
        //     };
        //
        //     return (
        //         <div>
        //             <h3>
        //                 Row Deleted <button onClick={handleClick}>UNDO</button>
        //             </h3>
        //         </div>
        //     );
        // };

        const deleteSectionHandler = catchAsync(async () => {
            await dispatch(deleteSection(section.id));
            dispatch(setData({
                modify: {
                    type: 'section',
                    part: 'projects',
                    id: section.id,
                    key: 'id',
                    nestedProperties: ['projects', 'sections'],
                    deleteMatchedItem: true
                }
            }));
        }, {
            onLoad: "Deleting section",
            onSuccess: "Section deleted",
            onError: "Delete section failed",
        });

        const onEnterKeyPressed = (e) => e.key === "Enter" ? updateSectionHandler() : null;

        const [isSectionEditable, setIsSectionEditable] = useState(false);
        const [sectionTitle, setSectionTitle] = useState(section.title);
        const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

        const updateSectionHandler = catchAsync(async () => {
            setIsSubmitButtonDisabled(true);
            const updatedSection = await dispatch(updateSection(section.id, {title: sectionTitle}));
            dispatch(setData({
                modify: {
                    type: 'section',
                    part: 'projects',
                    id: section.id,
                    key: 'id',
                    data: updatedSection,
                    nestedProperties: ['projects', 'sections'],
                }
            }));
            setIsSectionEditable(false);
            setIsSubmitButtonDisabled(false);
        }, {
            onLoad: "Updating section",
            onSuccess: "Section updated",
            onError: "Update section failed"
        });

        const onSectionTitleEditInputChanged = (e) => setSectionTitle(e.target.value);

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
                                />
                                <button onClick={updateSectionHandler}><span className="far fa-check"></span></button>
                            </div>
                        ) : <h3 className="section-title">{section.title}</h3>}
                    </div>
                    <div className="section-tasks-head-menu">
                        <button className="head-item"
                                onClick={section.tasks ? () => setIsSectionEditable(!isSectionEditable) : null}>
                            <span className={[!isSectionEditable ? "far fa-pen" : "far fa-times"].join(" ")}></span>
                        </button>
                        <button className="head-item" onClick={deleteSectionHandler}>
                            <span className="far fa-trash-alt"></span>
                        </button>
                    </div>
                </div>

                <RenderTasks onSortEnd={onSortEnd} useDragHandle axis="y"/>

            </div>);
    }
;

export default SortableElement(SectionTasks);
