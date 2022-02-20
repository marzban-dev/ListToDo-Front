import React from "react";
import PropTypes from "prop-types";
import "./button.scss";

const Button =
    ({
         onClick,
         iconClass,
         text,
         size = 'md',
         circleShape,
         style,
         fullWidth,
         className
     }) => {
        return (
            <button
                className={[
                    "button",
                    circleShape ? `button-circle-size-${size}` : `button-size-${size}`,
                    fullWidth ? (!circleShape ? 'button-full-width' : null) : null,
                    className
                ].join(' ')}
                onClick={onClick}
                style={style}
            >
                <span className={["button-icon", iconClass].join(' ')}></span>
                {text ? <span className="button-text">{text}</span> : null}
            </button>
        )
    }

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    iconClass: PropTypes.string.isRequired,
    text: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    circleShape: PropTypes.bool,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
}

export default Button;