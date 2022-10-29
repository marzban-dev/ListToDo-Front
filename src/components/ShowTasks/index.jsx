import React from "react";
import {SortableContainer} from "react-sortable-hoc";
import sortListItems from "utils/SortListItems";
import SortableTask, {Task} from "components/Task";
import "./showTasks.scss";

export const ShowTasks =
    ({
         tasks,
         axis,
         secondaryColor,
         sortable = true,
         style,
         backgroundLocation,
         showParents
     }) => {
        return (
            <section
                className="tasks-list"
                style={{
                    flexDirection: axis === "xy" ? "row" : "column",
                    justifyContent: axis === "xy" ? "flex-start" : "center",
                    ...style
                }}
            >
                {sortListItems(tasks).map((task, index) => {
                    if (sortable) {
                        return !task.completed && (
                            <SortableTask
                                task={task}
                                key={task.id}
                                index={index}
                                secondaryColor={secondaryColor}
                                backgroundLocation={backgroundLocation}
                                showParents={showParents}
                            />
                        );
                    } else {
                        return !task.completed && (
                            <Task
                                task={task}
                                key={task.id}
                                index={index}
                                dragHandlerIcon={false}
                                secondaryColor={secondaryColor}
                                backgroundLocation={backgroundLocation}
                                showParents={showParents}
                            />
                        );
                    }
                })}
            </section>
        )
    };

export default SortableContainer(ShowTasks);