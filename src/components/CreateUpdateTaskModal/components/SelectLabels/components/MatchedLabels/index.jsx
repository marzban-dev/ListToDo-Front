import React from "react";
import LabelItem from "components/LabelItem";
import {CSSTransition} from "react-transition-group";
import "./matchedLabels.scss";

const MatchedLabels = ({isMatchedLabelsListOpen, matchedLabels, setTaskLabels, taskLabels, labels}) => {

    const addSelectedLabel = (id) => {
        const selectedLabelsId =
            taskLabels.length !== 0 ? taskLabels : [];

        if (!selectedLabelsId.includes(id)) {
            setTaskLabels((state) => [...state, id]);
        }
    };

    const renderLabels = () => {
        const filteredLabels = labels.filter(label => matchedLabels.includes(label.id));

        // let filteredLabels = [];
        //
        // matchedLabels?.forEach((matchedLabel) => {
        //     const labelIndex = labels.findIndex(
        //         (label) => label.id === matchedLabel.id
        //     );
        //
        //     filteredLabels.push(labels[labelIndex]);
        // });

        return labels.length !== 0 ? (
                filteredLabels.length !== 0 ? (
                    filteredLabels.map((label) => {
                        return (
                            <LabelItem
                                disabled={taskLabels.find(labelId => labelId === label.id)}
                                title={label.title}
                                onClick={() => addSelectedLabel(label.id)}
                                key={label.id}
                                size="md"
                            />
                        )
                    })
                ) : (
                    <div className="labels-select-menu-no-match-found">
                        Nothing matched
                    </div>
                )
            ) :
            (
                <div className="labels-select-menu-no-match-found">
                    You haven't any label <span className="far fa-tags"></span>
                </div>
            )
    };

    return (
        <CSSTransition
            in={isMatchedLabelsListOpen}
            timeout={350}
            classNames="labels-box-fade"
            unmountOnExit
        >
            <ul tabIndex="0" className="labels-select-menu">
                {renderLabels()}
            </ul>
        </CSSTransition>
    );
}

export default MatchedLabels;