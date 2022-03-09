import React, {useState} from "react";
import {TOASTIFY_OPTIONS} from "config";
import ProfilePicture from "components/UI/ProfilePicture";
import {toast} from "react-toastify";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import ChangeProfileModal from "components/ChangeProfileModal";
import {useQueryClient} from "react-query";
import {useUpdateSettingsQuery} from "hooks/useAuth";
import UpperCaseFirstLetter from "utils/UpperCaseFirstLetter";
import "./profile.scss";

const Profile = () => {
    const queryClient = useQueryClient();
    const {username, header_img: wallpaper, profile_img: profile} = queryClient.getQueryData('user');
    const {mutateAsync: updateSettings} = useUpdateSettingsQuery();

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

            if (userPicture) settingsToUpdate.append('profile_img', userPicture, userPicture.name);
            if (userWallpaper) settingsToUpdate.append('header_img', userWallpaper, userWallpaper.name);
            if (userName !== username) settingsToUpdate.append("first_name", userName)
            if (!userPicture && !userWallpaper && userName === username) {
                toast.info("All things are the same.", {...TOASTIFY_OPTIONS, autoClose: 2000})
            } else {

                const uploadProgressHandler = (progressEvent) => {
                    const percentCompleted = progressEvent.loaded / progressEvent.total;
                    toast.update(alertId, {
                        progress: percentCompleted,
                    });
                }

                await updateSettings({
                    properties: settingsToUpdate, uploadProgressHandler
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
            <ProfileWallpaper
                wallpaperPicture={wallpaper}
                className="profile-background-image-loader"
                darkLayerOpacity={0.5}
            />
            <div className="profile-picture-container">
                <ProfilePicture
                    shadow
                    profilePicture={profile}
                    withEditButton
                    editButtonHandler={() => setIsModalOpen(true)}
                />

                <div className="profile-name">
                    {username ? UpperCaseFirstLetter(username) : 'Please Login'}
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