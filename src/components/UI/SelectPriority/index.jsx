import React from "react";
import SelectMenu from "components/UI/SelectMenu";

const SelectPriority = ({priority, setPriority}) => {

    const selectMenuOptions = [
        {
            iconClass: "fa fa-flag",
            text: "No Priority",
            value: null,
            iconColor: "var(--color-icon)"
        },
        {
            iconClass: "fa fa-flag",
            text: "Priority 1",
            value: 1,
            iconColor: "var(--color-priority-1)"
        },
        {
            iconClass: "fa fa-flag",
            text: "Priority 2",
            value: 2,
            iconColor: "var(--color-priority-2)"
        },
        {
            iconClass: "fa fa-flag",
            text: "Priority 3",
            value: 3,
            iconColor: "var(--color-priority-3)"
        },
        {
            iconClass: "fa fa-flag",
            text: "Priority 4",
            value: 4,
            iconColor: "var(--color-priority-4)"
        },
        {
            iconClass: "fa fa-flag",
            text: "Priority 5",
            value: 5,
            iconColor: "var(--color-priority-5)"
        },
    ];

    return (
        <SelectMenu
            options={selectMenuOptions}
            type="selectable-options"
            customButtonIcon="far fa-flag"
            activeOption={priority}
            setActiveOption={setPriority}
            customButtonIconColor={`var(${priority ? `--color-priority-${priority}` : "--color-icon"})`}
        />
    );
};

export default SelectPriority;
