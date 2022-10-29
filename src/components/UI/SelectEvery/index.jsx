import React from "react";
import SelectMenu from "components/UI/SelectMenu";

const SelectEvery = ({ every, setEvery }) => {
    const selectMenuOptions = [
        {
            iconClass: "far fa-circle-x",
            text: "No Every",
            value: null,
            iconColor: "var(--color-icon)",
        },
        {
            iconClass: "far fa-arrows-spin",
            text: "Every Day",
            value: 0,
            iconColor: "var(--color-priority-4)",
        },
        {
            iconClass: "far fa-circle-1",
            text: "Sunday",
            value: 1,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-2",
            text: "Monday",
            value: 2,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-3",
            text: "Tuesday",
            value: 3,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-4",
            text: "Wednesday",
            value: 4,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-5",
            text: "Thursday",
            value: 5,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-6",
            text: "Friday",
            value: 6,
            iconColor: "var(--color-priority-3)",
        },
        {
            iconClass: "far fa-circle-7",
            text: "Saturday",
            value: 7,
            iconColor: "var(--color-priority-3)",
        },
    ];

    const everyMenuButtonIcon = () => {
        if (every === null) return "far fa-calendar-day";
        if (every === 0) return "far fa-arrows-spin";
        return `far fa-circle-${every}`;
    };

    const everyMenuButtonColor = () => {
        if (every === null) return "var(--color-icon)";
        if (every === 0) return "var(--color-priority-4)";
        return "var(--color-priority-3)";
    };

    return (
        <SelectMenu
            options={selectMenuOptions}
            type="selectable-options"
            customButtonIcon={everyMenuButtonIcon()}
            customButtonIconColor={everyMenuButtonColor()}
            activeOption={every}
            setActiveOption={setEvery}
        />
    );
};

export default SelectEvery;
