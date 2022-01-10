import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {REACT_MODAL_OPTIONS, TOASTIFY_OPTIONS} from "config";
import Modal from "react-modal";
import ProfilePicture from "../UI/ProfilePicture/ProfilePicture";
import Button from "../UI/Button/Button";
import {updateUserSettings} from "../../store/actions/Auth.actions";
import {toast} from "react-toastify";
import "./profile.scss";

const Profile = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userWallpaperPreview, setUserWallpaperPreview] = useState(user.setting.header);
    const [userPicturePreview, setUserPicturePreview] = useState(user.setting.profile);
    const [userWallpaper, setUserWallpaper] = useState(null);
    const [userPicture, setUserPicture] = useState(null);

    const [userName, setUserName] = useState(user.username);

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
            hideProgressBar: false,
            progressStyle: {backgroundColor: "var(--color-primary)"},
        });

        try {
            const settingsToUpdate = new FormData();
            if (userPicture) settingsToUpdate.append('profile', userPicture, userPicture.name);
            if (userWallpaper) settingsToUpdate.append('header', userWallpaper, userWallpaper.name);
            if (userName !== user.username) settingsToUpdate.append("username", userName)
            if (!userPicture && !userWallpaper && userName === user.username) {
                toast.info("All things are the same.", {...TOASTIFY_OPTIONS, autoClose: 2000})
            } else {

                const uploadProgressHandler = (progressEvent) => {
                    const percentCompleted = progressEvent.loaded / progressEvent.total;
                    toast.update(alertId, {
                        progress: percentCompleted,
                    });
                }

                await dispatch(updateUserSettings(settingsToUpdate, uploadProgressHandler));

                toast.update(alertId, {
                    render: "Profile Updated",
                    type: "success",
                    isLoading: false,
                });
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
            <img className="profile-background-image" src={user.setting.header} alt="bg"/>
            <div className="profile-picture-container">
                <ProfilePicture
                    shadow
                    profilePicture={user.setting.profile}
                    withEditButton
                    editButtonHandler={() => setIsModalOpen(true)}
                />

                <div className="profile-name">
                    {user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Please Login'}
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
                                <img src={userWallpaperPreview} alt="bg"/>
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