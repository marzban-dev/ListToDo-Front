import React from "react";
import {SortableElement} from "react-sortable-hoc";

const SortableElementWrapper = ({children}) => {
    return children;
};

export default SortableElement(SortableElementWrapper);
