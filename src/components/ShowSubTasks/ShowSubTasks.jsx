import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom'
import {produce} from "immer";
import Task from "../Task/Task";
import {SortableContainer} from "react-sortable-hoc";
import {FindAndReturnProperties} from "../../Utils/HelperFunctionsForObjects";
import Button from "components/UI/Button/Button";
import {REACT_MODAL_OPTIONS} from "config";
import EmptySign from "../UI/EmptySign/EmptySign";
import "./ShowSubTasks.scss";

const ShowSubTasks = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const subTasks = useSelector(state => {
        return FindAndReturnProperties(
            state.main.projects,
            'task',
            location.state.parentTask.id,
            'id',
            ['tasks'],
            ['projects', 'sections', 'tasks']
        )
    });

    useEffect(() => {
        if (!location.state) navigate('/');
    }, []);

    const RenderSubTasks = SortableContainer(() => {
        const sortedTasksList = () => {
            if (subTasks.tasks.length === 0) {
                return <EmptySign text="Empty" style={{padding:"1.5rem 0"}}/>;
            } else {
                return produce(subTasks.tasks, draft => {
                    draft.sort((a, b) => a.position > b.position)
                }).map((subTask, index) => {
                    return !subTask.completed ? <Task key={index} index={index} task={subTask}/> : null;
                });
            }
        }

        return (
            <section className="sub-tasks-list">
                {sortedTasksList()}
            </section>
        )
    });

    const onSortEnd = ({oldIndex, newIndex}) => {};

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        if (!location.state.previousPath.includes('subtasks')) {
            setIsModalOpen(false)
            setTimeout(() => navigate(-1), REACT_MODAL_OPTIONS.closeTimeoutMS)
        } else {
            navigate(-1)
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            {...REACT_MODAL_OPTIONS}
        >
            <div className="sub-tasks">
                <div className="sub-tasks-head">
                    <h3 className="sub-tasks-head-title">{location.state.parentTask.title}</h3>
                </div>

                <RenderSubTasks onSortEnd={onSortEnd} useDragHandle axis="y"/>

                <div className="sub-tasks-add-button">
                    <Button
                        size="sm"
                        circleShape
                        iconClass="far fa-plus"
                        onClick={() => navigate(`/tasks/create`, {
                            state: {
                                taskId: location.state.parentTask.id, sectionId: location.state.parentTask.section.id
                            }
                        })}
                        style={{
                            marginTop: '1rem'
                        }}
                    />
                </div>

            </div>
        </Modal>
    );
}

export default ShowSubTasks;