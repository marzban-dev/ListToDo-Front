import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import xImg from "assets/img/MEBIB.gif";
import Button from "components/UI/Button";
import SkeletonLoader from "components/UI/SkeletonLoader";
import "./profilePicture.scss";

const ProfilePicture =
    ({
         shadow,
         withEditButton,
         editButtonHandler,
         profilePicture,
         style,
         className,
         preloaderStyle = {width: 90, height: 90}
     }) => {

        const [isProfileLoaded, setIsProfileLoaded] = useState(false);
        const profileImageElement = useRef(null);

        useEffect(() => {
            setIsProfileLoaded(false);

            if (profilePicture !== null) profileImageElement.current.src = null;
            else profileImageElement.current.src = xImg;

            const preloadImage = new Image();

            preloadImage.src = profilePicture;
            preloadImage.onload = () => {
                if (profileImageElement.current) {
                    setIsProfileLoaded(true);
                    profileImageElement.current.src = preloadImage.src;
                }
            };

        }, [profilePicture]);

        return (
            <div className={["profile-picture", className, shadow ? "profile-picture-shadow" : null].join(' ')}
                 style={style}>

                <img
                    ref={profileImageElement}
                    src={null}
                    style={{display: profilePicture ? (isProfileLoaded ? 'block' : 'none') : 'block'}}
                    alt="user-profile"
                />

                {!isProfileLoaded && profilePicture ?
                    <SkeletonLoader  {...preloaderStyle} viewBox="0 0 50 50" type="profile"/>
                    : null
                }

                {
                    withEditButton ?
                        <Button
                            className="profile-edit"
                            onClick={editButtonHandler}
                            iconClass="far fa-pen"
                            size="xs"
                            circleShape
                        /> : null
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
    shadow: PropTypes.bool,
    preloaderStyle: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    })
}

export default ProfilePicture;