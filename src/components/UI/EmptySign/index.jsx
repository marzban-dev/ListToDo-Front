import React from "react";
import "./emptySign.scss";

const EmptySign = ({text, style}) => {
    return (
        <div className="empty-sign" style={style}>
            <span className="fa fa-folder-open"></span>
            <h3>{text}</h3>
        </div>
    );
}

export default EmptySign;