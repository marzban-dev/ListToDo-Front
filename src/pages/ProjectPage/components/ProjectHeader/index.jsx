import React from 'react';
import SelectMenu from "components/UI/SelectMenu";
import {useDeleteProjectQuery, useUpdateProjectQuery} from "hooks/useProjectsData";
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
import DefaultWallpaper from "assets/img/wallpaper-placeholder.jpg";
import "./projectHeader.scss";

const ProjectHeader = ({project}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const labels = queryClient.getQueryData("labels");
    const {mutateAsync: deleteProject} = useDeleteProjectQuery(project.project, {
        onSuccess: () => redirectToPreviousRoute(),
    });

    const {mutateAsync: updateProject} = useUpdateProjectQuery(project.project, {
        onSuccess: () => redirectToPreviousRoute()
    });

    const redirectToPreviousRoute = () => {
        if (queryClient.getQueryData('inbox-project').id === project.project) {
            navigate("/projects")
        } else {
            console.log(404)
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
            await navigator.clipboard.writeText(`http://localhost:3000/join-to-project/${project.inviteSlug}`);
            alert('copied');
        }

        const msg = (
            <div className="show-project-invite-slug-msg-box">
                <Button onClick={copyInviteSlug} iconClass="far fa-copy" size="md"/>
                <div>{`http://localhost:3000/join-to-project/${project.inviteSlug}`}</div>
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
            },
            projectData: project
        });
    }, {
        onLoad: `Archiving project ${project.title}`,
        onSuccess: `Project ${project.title} archived`,
        onError: `Archive project ${project.title} failed`
    });

    const selectMenuOptions = [
        {
            iconClass: "far fa-pen",
            text: "Edit",
            action: () => navigate(`/update-project/${project.project}/${project.id}`, {state: {backgroundLocation: location}})
        },
        {
            iconClass: "far fa-archive",
            text: "Archive", action: archiveProject
        },
        {
            iconClass: "far fa-user",
            text: "Invite Link", action: showProjectInviteSlug
        },
        {
            iconClass: "far fa-trash-alt",
            text: "Delete",
            action: deleteProjectHandler,
            yesNoQAlert: "Are you sure to delete this project ?",
            color: "danger"
        }
    ];

    const renderLabels = () => {
        const projectLabels = project.users.find(usr => usr.owner.id === user.id).label;
        const labelsToShow = labels.filter(label => projectLabels.includes(label.id));

        return labelsToShow.map((label) => {
            return (
                <LabelItem key={label.id} title={label.title} onClick={() => navigate("/labels/" + label.id)}/>
            );
        });
    }

    return (
        <div className="project-head-container">
            <ProfileWallpaper
                wallpaperPicture={
                    project.users.find(usr => usr.owner.id === user.id).background
                        ? project.users.find(usr => usr.owner.id === user.id).background
                        : DefaultWallpaper
                }
                className="project-wallpaper"
                darkLayerOpacity={0.5}
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
                        <div className="project-labels">
                            {renderLabels()}
                        </div>
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