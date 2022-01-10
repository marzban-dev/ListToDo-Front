import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import "./profilePicture.scss";

const ProfilePicture = ({shadow, withEditButton, editButtonHandler, profilePicture, style, className}) => {
    return (
        <div className={["profile-picture", className, shadow ? "profile-picture-shadow" : null].join(' ')} style={style}>
            <img src={profilePicture} alt="user-profile"/>

            {
                withEditButton ?
                    <Button
                        className="profile-edit"
                        onClick={editButtonHandler}
                        iconClass="far fa-pen"
                        size="xs"
                        circleShape
                    />
                    : null
            }

        </div>
    );
}

ProfilePicture.propTypes = {
    withEditButton: PropTypes.bool,
    editButtonHandler: PropTypes.func,
    profilePicture: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    shadow: PropTypes.bool
}

export default ProfilePicture;