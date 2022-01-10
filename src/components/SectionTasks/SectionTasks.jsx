import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {arrayMoveImmutable} from "array-move";
import {useDispatch} from "react-redux";
import {SortableContainer} from "react-sortable-hoc";
import {produce} from "immer";
import {toast} from "react-toastify";
import Task from "components/Task/Task";
import {deleteSection, fetchTasks} from "../../store/actions/ApiCalls.actions";
import {changePosition, setData} from "../../store/actions/Main.actions";
import SkeletonLoader from "../UI/SkeletonLoader/SkeletonLoader";
import {setProjects, updateProjectPosition} from "../../store/actions/Projects.actions";
import "./sectionTasks.scss";
import Button from "../UI/Button/Button";
import {TOASTIFY_OPTIONS} from "config";


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
                    return produce(section.tasks, draft => {
                        draft.sort((a, b) => a.position > b.position)
                    }).map((task, index) => {
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
            }
        )

        /**
         * This function is call every time when task lists change (react-sortable-hoc).
         */

        const onSortEnd = ({oldIndex, newIndex}) => dispatch(
            changePosition('section', 'task', section.id, oldIndex, newIndex, section.tasks)
        );

        const Undo = ({onUndo, closeToast}) => {
            const handleClick = () => {
                onUndo();
                closeToast();
            };

            return (
                <div>
                    <h3>
                        Row Deleted <button onClick={handleClick}>UNDO</button>
                    </h3>
                </div>
            );
        };

        const DeleteSection = async () => {
            const alertId = toast.loading("Deleting Section", TOASTIFY_OPTIONS);

            try {
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
                toast.update(alertId, {
                    render: "Section Deleted",
                    type: "success",
                    isLoading: false,
                    ...TOASTIFY_OPTIONS
                });
            } catch (error) {
                console.log(error)
                toast.update(alertId, {
                    render: "Deleting Section Failed",
                    type: "error",
                    isLoading: false,
                    ...TOASTIFY_OPTIONS
                });
            }
        }

        return (
            <div className="section-tasks">
                <div className="section-tasks-head">
                    <h3 className="section-tasks-head-title">{section.title}</h3>
                    <div className="section-tasks-head-menu">
                        <span className="far fa-trash-alt" onClick={DeleteSection}></span>
                    </div>
                </div>

                <RenderTasks onSortEnd={onSortEnd} useDragHandle axis="y"/>

            </div>);
    }
;

export default SectionTasks;
