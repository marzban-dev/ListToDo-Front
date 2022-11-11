import React from "react";
import "./dragHandler.scss";

const DragHandler = () => {
    return (
        <div className="drag-handler">
            <span className="far fa-grip-lines"></span>
        </div>
    );
};

// export default SortableHandle(DragHandler);
export default DragHandler;