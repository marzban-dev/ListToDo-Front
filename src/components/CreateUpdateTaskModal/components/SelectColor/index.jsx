import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {CSSTransition} from "react-transition-group";
import "./selectColor.scss";

const SelectColor = ({taskColor, setTaskColor, isPriorityListOpen}) => {
    const colors = useSelector((state) => state.main.colors);
    const [isColorListOpen, setIsColorListOpen] = useState(false);

    const Color = ({id, hex}) => {
        const onColorChanged = (e) => setTaskColor(e.target.value);

        return (
            <div className="colors-item" key={id}>
                <input
                    type="radio"
                    id={`color-input-${id}`}
                    hidden
                    value={hex}
                    onChange={onColorChanged}
                    onClick={() => setIsColorListOpen(false)}
                />
                <label htmlFor={`color-input-${id}`}>
                    <div
                        style={{
                            backgroundColor: hex.toLowerCase(),
                            opacity: taskColor === hex ? 1 : 0.5,
                        }}
                    ></div>
                </label>
            </div>
        );
    };

    const nodeRef = useRef(null);

    return (
        <div className="colors col-1">
            <CSSTransition
                in={isColorListOpen && !isPriorityListOpen}
                timeout={500}
                nodeRef={nodeRef}
                onExited={() => setIsColorListOpen(false)}
                classNames="fade"
                unmountOnExit
            >
                <div className="colors-list" ref={nodeRef}>
                    {colors.map(({id, color}) => (
                        id !== 0 ? <Color key={id} id={id} hex={color}/> : null
                    ))}
                </div>
            </CSSTransition>
            <button
                className={[
                    "colors-open-list-button",
                    isColorListOpen ? "colors-open-list-button-active" : null,
                ].join(" ")}
                onClick={() => setIsColorListOpen(!isColorListOpen)}
            >
                <span style={{backgroundColor: taskColor ? taskColor.toLowerCase() : "transparent"}}></span>
            </button>
        </div>
    );
};

export default SelectColor;
