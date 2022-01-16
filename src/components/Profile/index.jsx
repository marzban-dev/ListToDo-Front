import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {REACT_MODAL_OPTIONS, TOASTIFY_OPTIONS} from "config";
import Modal from "react-modal";
import ProfilePicture from "../UI/ProfilePicture";
import Button from "../UI/Button";
import {updateUserSettings} from "../../store/actions/Auth.actions";
import {toast} from "react-toastify";
import "./profile.scss";
import ProfileWallpaper from "../UI/ProfileWallpaper";
import ChangeProfileModal from "../ChangeProfileModal";

const Profile = () => {

    const dispatch = useDispatch();
    const username = useSelector(state => state.auth.user.username);
    const wallpaper = useSelector(state => state.auth.user.setting.header);
    const profile = useSelector(state => state.auth.user.setting.profile);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userWallpaper, setUserWallpaper] = useState(null);
    const [userPicture, setUserPicture] = useState(null);
    const [userName, setUserName] = useState(username);


    const saveChanges = async () => {
        const alertId = toast.loading("Updating Profile", {
            ...TOASTIFY_OPTIONS,
            hideProgressBar: false,
            progressStyle: {backgroundColor: "var(--color-primary)"},
        });

        try {
            const settingsToUpdate = new FormData();

            if (userPicture) settingsToUpdate.append('profile', userPicture, userPicture.name);
            if (userWallpaper) settingsToUpdate.append('header', userWallpaper, userWallpaper.name);
            if (userName !== username) settingsToUpdate.append("username", userName)
            if (!userPicture && !userWallpaper && userName === username) {
                toast.info("All things are the same.", {...TOASTIFY_OPTIONS, autoClose: 2000})
            } else {

                const uploadProgressHandler = (progressEvent) => {
                    const percentCompleted = progressEvent.loaded / progressEvent.total;
                    toast.update(alertId, {
                        progress: percentCompleted,
                    });
                }

                await dispatch(updateUserSettings(settingsToUpdate, uploadProgressHandler));
            }
        } catch (error) {
            toast.update(alertId, {
                render: "Update Profile Failed",
                type: "error",
                isLoading: false,
            });
        }
    }

    return (
        <div className="profile">
            <ProfileWallpaper wallpaperPicture={wallpaper} className="profile-background-image-loader"/>
            <div className="profile-picture-container">
                <ProfilePicture
                    shadow
                    profilePicture={profile}
                    withEditButton
                    editButtonHandler={() => setIsModalOpen(true)}
                />

                <div className="profile-name">
                    {username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Please Login'}
                </div>
            </div>

            <ChangeProfileModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                userName={userName}
                saveChanges={saveChanges}
                wallpaper={wallpaper}
                profile={profile}
                setUserWallpaper={setUserWallpaper}
                setUserPicture={setUserPicture}
                setUserName={setUserName}
            />
        </div>
    );
};

export default Profile;