import React, {useEffect, useRef, useState} from "react";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import "./profileWallpaper.scss";

const ProfileWallpaper = ({wallpaperPicture, className}) => {

    const [isWallpaperLoaded, setIsWallpaperLoaded] = useState(false);
    const wallpaperImageElement = useRef(null);

    useEffect(() => {

        setIsWallpaperLoaded(false);
        wallpaperImageElement.current.src = null;

        const preloadImage = new Image();

        preloadImage.src = wallpaperPicture;
        preloadImage.onload = () => {
            setIsWallpaperLoaded(true);
            wallpaperImageElement.current.src = preloadImage.src;
        };

    }, [wallpaperPicture]);

    return (
        <div className={["profile-wallpaper", className].join(' ')}>
            <img
                className="profile-wallpaper-image"
                ref={wallpaperImageElement}
                src={null}
                style={{display: isWallpaperLoaded ? 'block' : 'none'}}
                alt="user-wallpaper"
            />

            {!isWallpaperLoaded ?
                <SkeletonLoader
                    width="100%"
                    height="100%"
                    viewBox="0 0 100% 100%"
                    type="wallpaper"
                /> : null
            }
        </div>
    )
}

export default ProfileWallpaper;