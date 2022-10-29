import React from "react";
import {SortableContainer} from "react-sortable-hoc";

const Wrapper = ({children}) => children;

export default SortableContainer(Wrapper);