import React from "react";
import {SortableHandle} from "react-sortable-hoc";
import "./dragHandler.scss";

const DragHandler = SortableHandle(() => {
    return (
        <div className="drag-handler">
            <span className="far fa-grip-lines"></span>
        </div>
    );
});
export default DragHandler;