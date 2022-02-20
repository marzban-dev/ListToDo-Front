import React from "react";
import {SortableContainer} from "react-sortable-hoc";
import sortListItems from "Utils/SortListItems";
import SectionTasks from "components/SectionTasks";

export const ShowSections = ({sections}) => {
    return (
        <section className="sections">
            {sortListItems(sections).map((section, index) => (
                <SectionTasks section={section} key={index} index={index}/>
            ))}
        </section>
    )
};

export default SortableContainer(ShowSections);