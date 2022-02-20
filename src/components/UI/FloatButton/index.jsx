import React from "react";
import Button from "components/UI/Button";
import "./floatButton.scss";

const FloatButton = ({float, iconClass, onClick}) => {
    let floatClass;

    switch (float) {
        case "r":
            floatClass = "float-right";
            break;
        case "l":
            floatClass = "float-left";
            break;
        default:
            floatClass = "float-right";
            break;
    }

    return (
        <Button
            onClick={onClick}
            className={floatClass}
            iconClass={iconClass}
            size="lg"
            style={{width : "60px", height : "60px"}}
            circleShape
        />
    );
};

export default FloatButton;
