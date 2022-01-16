import React from "react";
import "./label.scss";

const Label = ({id, title, active, onLabelSelected}) => {

    return (
        <div className={["label", active ? "label-active" : null].join(" ")}>
            <input type="radio" id={`label-${id}`} onChange={onLabelSelected} value={id} hidden/>
            <label htmlFor={`label-${id}`}>
                <div className="label-icon">
                    <span className="far fa-tag"></span>
                </div>
            </label>
            <span className="label-text">{title}</span>
        </div>
    )
}
export default Label;