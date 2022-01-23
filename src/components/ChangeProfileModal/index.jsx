import React, {useState} from "react";
import Modal from "react-modal";
import {REACT_MODAL_OPTIONS} from "config";
import ProfileWallpaper from "../UI/ProfileWallpaper";
import Button from "../UI/Button";
import ProfilePicture from "../UI/ProfilePicture";
import "./changeProfileModal.scss";

const ChangeProfileModal =
    ({
         userName,
         saveChanges,
         isOpen,
         setIsOpen,
         wallpaper,
         profile,
         setUserWallpaper,
         setUserPicture,
         setUserName
     }) => {

        const [userWallpaperPreview, setUserWallpaperPreview] = useState(wallpaper);
        const [userPicturePreview, setUserPicturePreview] = useState(profile);

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

        const setNewName = (e) => setUserName(e.target.value);

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                {...REACT_MODAL_OPTIONS}
            >
                <div className="upload-picture-modal">
                    <div className="upload-picture-modal-inputs">
                        <div className="upload-picture-modal-inputs-wallpaper">
                            <div className="upload-picture-modal-wallpaper-preview">
                                <ProfileWallpaper
                                    wallpaperPicture={userWallpaperPreview}
                                    className="upload-profile-background-image-loader"
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
        );
    }

export default ChangeProfileModal;