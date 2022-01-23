import React, {useRef} from "react";
import {CSSTransition} from "react-transition-group";
import "./selectPriority.scss";

const SelectPriority = ({taskPriority, setTaskPriority, isPriorityListOpen, setIsPriorityListOpen}) => {

    const onPriorityChanged = (e) => setTaskPriority(Number(e.target.value));

    const PriorityItem = ({id}) => {
        return (
            <div className="priority-item">
                <input
                    type="radio"
                    id={`priority-input-${id}`}
                    hidden
                    value={id}
                    onChange={onPriorityChanged}
                    onClick={() => setIsPriorityListOpen(false)}
                />
                <label htmlFor={`priority-input-${id}`}>
                    <span
                        style={{
                            color: `var(--color-priority-${id})`,
                            opacity: taskPriority === id ? 1 : 0.5
                        }}
                        className="fa fa-flag"
                    >
                    </span>
                </label>
            </div>
        );
    };

    const nodeRef = useRef(null);

    return (
        <div className="new-task-priority col-1">
            <CSSTransition
                in={isPriorityListOpen}
                timeout={300}
                nodeRef={nodeRef}
                classNames="fade"
                unmountOnExit
            >
                <div className="new-task-priority-list" ref={nodeRef}>

                    <button className="priority-item-delete-selection" onClick={() => setTaskPriority(0)}>
                        <span className="fa fa-trash"></span>
                    </button>

                    {[1, 2, 3, 4, 5].map((id) => <PriorityItem key={id} id={id}/>)}

                </div>
            </CSSTransition>
            <button
                className={[
                    "new-task-priority-open-list-button",
                    isPriorityListOpen ? "priority-list-button-active" : null,
                ].join(" ")}
                onClick={() => setIsPriorityListOpen(!isPriorityListOpen)}
            >
                <span
                    className="fa fa-flag"
                    style={{color: taskPriority ? `var(--color-priority-${taskPriority})` : "var(--color-icon)"}}
                ></span>
            </button>
        </div>
    );
};

export default SelectPriority;
