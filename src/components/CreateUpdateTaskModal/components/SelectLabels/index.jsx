import React, {useEffect, useState} from "react";
import SelectedLabels from "./components/SelectedLabels";
import MatchedLabels from "./components/MatchedLabels";
import {useQueryClient} from "react-query";
import "./selectLabels.scss";

const SelectLabels = ({taskLabels, setTaskLabels}) => {
    const queryClient = useQueryClient();
    const labels = queryClient.getQueryData('labels');
    const [matchedLabels, setMatchedLabels] = useState([]);
    const [isMatchedLabelsListOpen, setIsMatchedLabelsListOpen] = useState(false);

    useEffect(() => setMatchedLabels(labels.map(lbl => lbl.id)), [labels]);

    const onLabelInputChange = (e) => {
        setMatchedLabels([]);
        setIsMatchedLabelsListOpen(true);

        const filteredLabels = labels.filter((label) =>
            label.title.toLowerCase().includes(e.target.value)
        );

        setMatchedLabels(filteredLabels.map(lbl => lbl.id));
    };

    const onLabelInputFocusedIn = () => setIsMatchedLabelsListOpen(true);
    const onLabelInputFocusedOut = () => setIsMatchedLabelsListOpen(false);

    const closeLabelsMenu = (e) => {
        const currentTarget = e.currentTarget;

        requestAnimationFrame(() => {
            if (!currentTarget.contains(e.relatedTarget)) {
                setIsMatchedLabelsListOpen(false);
            }
        });
    }

    return (
        <div className="labels" onBlur={closeLabelsMenu}>
            <MatchedLabels
                labels={labels}
                taskLabels={taskLabels}
                setTaskLabels={setTaskLabels}
                matchedLabels={matchedLabels}
                isMatchedLabelsListOpen={isMatchedLabelsListOpen}
            />

            <div className="labels-input">
                <span className="far fa-tags"></span>
                <input
                    type="text"
                    onChange={onLabelInputChange}
                    onFocus={onLabelInputFocusedIn}
                    onBlur={onLabelInputFocusedOut}
                    placeholder="Write label name"
                />
            </div>

            <SelectedLabels taskLabels={taskLabels} setTaskLabels={setTaskLabels} labels={labels}/>
        </div>
    );
};

export default SelectLabels;
