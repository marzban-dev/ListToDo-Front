import React from "react";
import {SortableContainer} from "react-sortable-hoc";
import sortListItems from "Utils/SortListItems";
import SortableTask, {Task} from "components/Task";
import "./showTasks.scss";

export const ShowTasks = ({tasks, sortable = true}) => {
    return (
        <section className="tasks-list">
            {tasks.length !== 0 && sortListItems(tasks).map((task, index) => {
                if (sortable) {
                    return !task.completed && <SortableTask task={task} key={task.id} index={index}/>;
                } else {
                    return !task.completed && <Task task={task} key={task.id} index={index} dragHandlerIcon={false}/>;
                }
            })}
        </section>
    )
};

export default SortableContainer(ShowTasks);