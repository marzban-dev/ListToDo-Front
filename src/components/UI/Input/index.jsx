import React from "react";
import "./input.scss";

const Input = ({type, className, disabled, ...otherProps}) => {
    return (
        <input
            type={type}
            className={["input", disabled ? "input-disabled" : null].join(' ')}
            disabled={disabled}
            {...otherProps}
        />
    );
}

export default Input;