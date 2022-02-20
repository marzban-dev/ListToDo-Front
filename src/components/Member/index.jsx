import React from 'react';
import PropTypes from "prop-types";
import "./member.scss";

const Member = ({picture, name, widthSize = "20px", defaultIconSize = "20px", disableHover, style}) => {
    return (
        <div
            className={["member", !disableHover ? "member-hover-effect" : null].join(' ')}
            data-tip={name}
            style={{width: widthSize, ...style}}
        >
            {picture ? <img src={picture} alt={name}/> :
                <span style={{fontSize: defaultIconSize}} className="far fa-user-circle"></span>}
        </div>
    );
}

Member.propTypes = {
    picture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    widthSize: PropTypes.string,
    defaultIconSize: PropTypes.string,
    disableHover: PropTypes.bool,
}

export default Member;