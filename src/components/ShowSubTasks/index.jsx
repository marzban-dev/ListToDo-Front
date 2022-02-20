import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom'
import Task from "components/Task";
import {SortableContainer} from "react-sortable-hoc";
import {FindAndReturnProperties} from "Utils/HelperFunctionsForObjects";
import Button from "components/UI/Button";
import {REACT_MODAL_OPTIONS} from "config";
import EmptySign from "components/UI/EmptySign";
import {changePosition} from "store/actions/Main.actions";
import SortableElementWrapper from "components/hoc/SortableElementWrapper";
import sortListItems from "Utils/SortListItems";
import "./ShowSubTasks.scss";

const ShowSubTasks = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
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
                return <EmptySign text="Empty" style={{padding: "1.5rem 0"}}/>;
            } else {
                return sortListItems(subTasks.tasks).map((subTask, index) => {
                    return !subTask.completed ? (
                        <SortableElementWrapper key={index} index={index}>
                            <Task task={subTask}/>
                        </SortableElementWrapper>
                    ) : null;
                });
            }
        }

        return (
            <section className="sub-tasks-list">
                {sortedTasksList()}
            </section>
        )
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        console.log(location.state.parentTask.id, subTasks);
        dispatch(
            changePosition('task', 'task', 'tasks', location.state.parentTask.id, oldIndex, newIndex, subTasks.tasks)
        )
    };

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