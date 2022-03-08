import React from "react";
import {SortableContainer} from "react-sortable-hoc";
import sortListItems from "utils/SortListItems";
import SectionTasks from "components/SectionTasks";

export const ShowSections = ({sections}) => {
    return (
        <section className="sections">
            {sortListItems(sections).map((section, index) => {
                return !section.archive ? <SectionTasks section={section} key={index} index={index}/> : null;
            })}
        </section>
    )
};

export default SortableContainer(ShowSections);