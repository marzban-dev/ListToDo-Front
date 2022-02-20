import React from "react";
import LabelItem from "components/LabelItem";
import "./selectedLabels.scss";

const SelectedLabels = ({taskLabels, setTaskLabels, labels}) => {

    const removeSelectedLabel = (id) => {
        setTaskLabels((state) => state.filter(labelId => labelId !== id));
    };

    const renderLabels = () => {
        const labelsToShow = labels.filter(label => taskLabels.includes(label.id));

        return labelsToShow.map((label) => {
            return (
                <LabelItem
                    key={label.id}
                    title={label.title}
                    onClick={() => removeSelectedLabel(label.id)}
                    size="md"
                />
            );
        });
    }

    return taskLabels.length !== 0 ? (
        <ul className="labels-selected">
            {renderLabels()}
        </ul>
    ) : (
        <p className="no-label-selected">No label selected</p>
    );
}

export default SelectedLabels;