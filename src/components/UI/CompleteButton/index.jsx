import React, {useState} from "react";
import "./completeButton.scss";

const CompleteButton = ({onChange, isCompleted, priorityColor}) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    return (
        <React.Fragment>
            <button
                className={[
                    "task-input-checkbox",
                    isCompleted ? "task-input-checkbox-active" : null,
                    isMouseDown ? "task-input-checkbox-mouse-down" : null,
                ].join(' ')}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    onChange();
                }}
                style={{borderColor: priorityColor ? `var(--color-priority-${priorityColor})` : null}}
            >
                <span className="far fa-check"></span>
            </button>
        </React.Fragment>
    )
}

export default CompleteButton;