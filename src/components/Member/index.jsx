import React from 'react';
import PropTypes from "prop-types";
import "./member.scss";

const Member = ({picture, name, defaultIconSize = "20px", disableHover, style}) => {

    return (
        <div
            className={["member", !disableHover ? "member-hover-effect" : null].join(' ')}
            data-tip={name}
            data-effect="solid"
            style={style}
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
    defaultIconSize: PropTypes.string,
    disableHover: PropTypes.bool,
}

export default Member;