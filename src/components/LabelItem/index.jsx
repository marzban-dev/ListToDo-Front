import React from "react";
import PropTypes from "prop-types";
import "./labelItem.scss";

const LabelItem = ({title, onClick, size = "sm", style, className, disabled}) => {
    return (
        <li
            className={[
                "label-item",
                `label-item-size-${size}`,
                onClick ? "label-item-hover-effect" : null,
                disabled ? "label-item-disabled" : null,
                className
            ].join(" ")}
            style={style}
            onClick={onClick}
        >
            <div className="label-item-title">
                <span>{title}</span>
            </div>

            <div className="label-item-shape">
                <div></div>
            </div>
        </li>
    );
}

LabelItem.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['sm', 'md']),
    style: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool
}

export default LabelItem;