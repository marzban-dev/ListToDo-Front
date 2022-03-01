import React from "react";
import {SortableContainer} from "react-sortable-hoc";
import sortListItems from "utils/SortListItems";
import SortableTask, {Task} from "components/Task";
import "./showTasks.scss";

export const ShowTasks = ({tasks, secondaryColor, sortable = true, style}) => {
    return (
        <section className="tasks-list" style={style}>
            {tasks.length !== 0 && sortListItems(tasks).map((task, index) => {
                if (sortable) {
                    return !task.completed && <SortableTask
                        task={task}
                        key={task.id}
                        index={index}
                        secondaryColor={secondaryColor}
                    />;
                } else {
                    return !task.completed && <Task
                        task={task}
                        key={task.id}
                        index={index}
                        dragHandlerIcon={false}
                        secondaryColor={secondaryColor}
                    />;
                }
            })}
        </section>
    )
};

export default SortableContainer(ShowTasks);