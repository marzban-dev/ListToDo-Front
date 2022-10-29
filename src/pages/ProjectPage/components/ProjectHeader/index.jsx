import React from 'react';
import SelectMenu from "components/UI/SelectMenu";
import {
    useChangeProjectInviteQuery,
    useDeleteProjectQuery,
    useLeaveProjectQuery,
    useUpdateProjectQuery
} from "hooks/useProjectsData";
import catchAsync from "utils/CatchAsync";
import Members from "components/Members";
import ScheduleProgressBar from "components/ScheduleProgressBar";
import LabelItem from "components/LabelItem";
import Button from "components/UI/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useQueryClient} from "react-query";
import {toast} from "react-toastify";
import {TOASTIFY_OPTIONS} from "config";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import DefaultWallpaperLight from "assets/img/wallpaper-placeholder-light.jpg";
import DefaultWallpaperDark from "assets/img/wallpaper-placeholder-dark.jpg";
import "./projectHeader.scss";

const ProjectHeader = ({project}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const labels = queryClient.getQueryData("labels");
    const appTheme = localStorage.getItem("APP_THEME");

    const {mutateAsync: deleteProject} = useDeleteProjectQuery(project.project, {
        onSuccess: () => redirectToPreviousRoute(),
    });

    const {mutateAsync: updateProject} = useUpdateProjectQuery(project.project, {
        onSuccess: () => redirectToPreviousRoute()
    });

    const {mutateAsync: changeInviteSlug} = useChangeProjectInviteQuery(project.id);

    const {mutateAsync: leaveProject} = useLeaveProjectQuery(project.id, {
        onSuccess: () => redirectToPreviousRoute()
    });

    const redirectToPreviousRoute = () => {
        if (queryClient.getQueryData('inbox-project').id === project.project) {
            navigate("/projects")
        } else {
            navigate(-1);
        }
    }

    const deleteProjectHandler = catchAsync(async () => {
        await deleteProject({id: project.id, label: project.users.find(usr => usr.owner.id === user.id).label});
    }, {
        onLoad: `Deleting project ${project.title}`,
        onSuccess: `Project ${project.title} deleted`,
        onError: `Deleting project ${project.title} failed`
    });


    const showProjectInviteSlug = () => {

        const copyInviteSlug = async (e) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(`https://listtodo2030.pythonanywhere.com/${project.inviteSlug}`);
            alert('copied');
        }

        const msg = (
            <div className="show-project-invite-slug-msg-box">
                <Button onClick={copyInviteSlug} iconClass="far fa-copy" size="md"/>
                <div>{`https://listtodo2030.pythonanywhere.com/${project.inviteSlug}`}</div>
            </div>
        )

        toast(msg, {
            ...TOASTIFY_OPTIONS,
            autoClose: 5000,
            position: "bottom-right",
            closeButton: false
        });
    }

    const archiveProject = catchAsync(async () => {
        await updateProject({
            data: {archive: true},
            personalizeData: {
                label: project.users.find(usr => usr.owner.id === user.id).label,
                color: project.users.find(usr => usr.owner.id === user.id).color,
                id: project.users.find(usr => usr.owner.id === user.id).id
            },
            projectData: project
        });
    }, {
        onLoad: `Archiving project ${project.title}`,
        onSuccess: `Project ${project.title} archived`,
        onError: `Archive project ${project.title} failed`
    });

    const leaveProjectHandler = catchAsync(async () => {
        await leaveProject();
    }, {
        onLoad: `Leaving project ${project.title}`,
        onSuccess: `You leaved Project ${project.title}`,
        onError: `Leave project ${project.title} failed`
    });

    const changeInviteSlugHandler = catchAsync(async () => {
        await changeInviteSlug();
    }, {
        onLoad: `Changing project invite link`,
        onSuccess: `Invite link changed`,
        onError: `Change project invite link failed`
    });

    const selectMenuOptions = [
        {
            iconClass: "far fa-pen",
            text: "Edit",
            action: () => navigate({
                pathname: `/update-project/${project.project}/${project.id}`,
                search: `?bl=${JSON.stringify(location)}`
            })
        },
        {
            iconClass: "far fa-archive",
            text: "Archive", action: archiveProject
        },
        {
            iconClass: "far fa-user",
            text: "Invite",
            action: showProjectInviteSlug
        },
    ];

    if (user.id === project.owner.id) {
        selectMenuOptions.push({
            iconClass: "far fa-user-edit",
            text: "Refresh Invite",
            action: changeInviteSlugHandler
        });
        selectMenuOptions.push({
            iconClass: "far fa-trash-alt",
            text: "Delete",
            action: deleteProjectHandler,
            yesNoQAlert: "Are you sure to delete this project ?",
            color: "danger"
        });
    } else {
        selectMenuOptions.push({
            iconClass: "far fa-sign-out",
            text: "Leave",
            action: leaveProjectHandler,
            yesNoQAlert: "Are you sure to leave this project ?",
            color: "warning"
        });
    }

    const renderLabels = () => {
        const projectLabels = project.users.find(usr => usr.owner.id === user.id).label;
        const labelsToShow = labels.filter(label => projectLabels.includes(label.id));

        return labelsToShow.length !== 0 && (
            <div className="project-labels">
                {labelsToShow.map((label) => {
                    return (
                        <LabelItem
                            className="fa-sign-out"
                            key={label.id}
                            title={label.title}
                            onClick={() => navigate("/labels/" + label.id)}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className="project-head-container">
            <ProfileWallpaper
                wallpaperPicture={
                    project.users.find(usr => usr.owner.id === user.id).background
                        ? project.users.find(usr => usr.owner.id === user.id).background
                        : appTheme === "light" ? DefaultWallpaperLight : DefaultWallpaperDark
                }
                className="project-wallpaper"
                darkLayerOpacity={appTheme === "light" ? 0.7 : 0.5}
            />
            <div className="project-head-details">
                <div className="project-head-top-section">
                    <h3>{project.title}</h3>
                    <SelectMenu buttonAxis="v" options={selectMenuOptions} type="executable-options"/>
                </div>
                <div className="project-head-bottom-section">
                    <div className="project-head-bottom-left-side">
                        {project.schedule && (
                            <ScheduleProgressBar
                                createdTime={project.created}
                                deadTime={project.schedule}
                                width={180}
                            />
                        )}
                        {renderLabels()}
                    </div>
                    <div className="project-head-bottom-right-side">
                        {!!project.users && (
                            <Members
                                axis="r"
                                compressed
                                width={35}
                                gap={15}
                                members={project.users}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectHeader;