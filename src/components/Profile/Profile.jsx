import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {REACT_MODAL_OPTIONS, TOASTIFY_OPTIONS} from "config";
import Modal from "react-modal";
import ProfilePicture from "../UI/ProfilePicture/ProfilePicture";
import Button from "../UI/Button/Button";
import {updateUserSettings} from "../../store/actions/Auth.actions";
import {toast} from "react-toastify";
import "./profile.scss";
import ProfileWallpaper from "../UI/ProfileWallpaper/ProfileWallpaper";

const Profile = () => {

    const dispatch = useDispatch();
    const username = useSelector(state => state.auth.user.username);
    const wallpaper = useSelector(state => state.auth.user.setting.header);
    const profile = useSelector(state => state.auth.user.setting.profile);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userWallpaperPreview, setUserWallpaperPreview] = useState(wallpaper);
    const [userPicturePreview, setUserPicturePreview] = useState(profile);
    const [userWallpaper, setUserWallpaper] = useState(null);
    const [userPicture, setUserPicture] = useState(null);

    const [userName, setUserName] = useState(username);

    const setNewPicture = (e) => {
        if (e.target.files.length > 0) {
            setUserPicture(e.target.files[0]);
            const pic = URL.createObjectURL(e.target.files[0]);
            setUserPicturePreview(pic);
        }
    }

    const setNewWallpaper = (e) => {
        if (e.target.files.length > 0) {
            setUserWallpaper(e.target.files[0]);
            const pic = URL.createObjectURL(e.target.files[0]);
            setUserWallpaperPreview(pic);
        }
    }

    const setNewName = (e) => {
        setUserName(e.target.value);
    }

    const saveChanges = async () => {
        const alertId = toast.loading("Updating Profile", {
            ...TOASTIFY_OPTIONS,
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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                {...REACT_MODAL_OPTIONS}
            >
                <div className="upload-picture-modal">
                    <div className="upload-picture-modal-inputs">
                        <div className="upload-picture-modal-inputs-wallpaper">
                            <div className="upload-picture-modal-wallpaper-preview">
                                <ProfileWallpaper
                                    wallpaperPicture={userWallpaperPreview}
                                    className="profile-background-image-loader"
                                />
                                <label className="upload-input-label" htmlFor="user-wallpaper-picture">
                                    <Button
                                        onClick={() => document.getElementById('user-wallpaper-picture').click()}
                                        iconClass="far fa-pen"
                                        circleShape
                                        size="xs"
                                    />
                                </label>
                                <input
                                    type="file"
                                    onChange={setNewWallpaper}
                                    accept="image/*"
                                    id="user-wallpaper-picture"
                                    hidden
                                />
                            </div>
                            <div className="upload-picture-modal-inputs-wrapper">
                                <ProfilePicture shadow profilePicture={userPicturePreview}/>
                                <label className="upload-input-label" htmlFor="user-profile-picture">
                                    <Button
                                        onClick={() => document.getElementById('user-profile-picture').click()}
                                        iconClass="far fa-camera-alt"
                                        text="Change"
                                        size="md"
                                    />
                                </label>
                                <input
                                    type="file"
                                    onChange={setNewPicture}
                                    accept="image/*"
                                    id="user-profile-picture"
                                    hidden
                                />
                            </div>
                        </div>
                        <div className="upload-picture-modal-inputs-name col-12">
                            <input
                                className="upload-picture-modal-profile-name col-10"
                                type="text" placeholder="Name"
                                value={userName}
                                onChange={setNewName}
                            />
                            <div className="upload-picture-modal-profile-button col-2">
                                <Button
                                    onClick={saveChanges}
                                    iconClass="far fa-save"
                                    size="md"
                                    circleShape
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;