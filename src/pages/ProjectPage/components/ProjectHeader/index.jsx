import React from 'react';
import SelectMenu from "components/UI/SelectMenu";
import {useDeleteProjectQuery} from "hooks/useProjectsData";
import catchAsync from "utils/CatchAsync";
import Members from "components/Members";
import ScheduleProgressBar from "components/ScheduleProgressBar";
import LabelItem from "components/LabelItem";
import Button from "components/UI/Button";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "react-query";
import {toast} from "react-toastify";
import {TOASTIFY_OPTIONS} from "config";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import "./projectHeader.scss";

const ProjectHeader = ({project}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const labels = queryClient.getQueryData("labels");
    const {mutateAsync: deleteProject} = useDeleteProjectQuery(project.project, {
        onSuccess: () => {
            if (queryClient.getQueryData('inbox-project').id === project.project) {
                navigate("/projects")
            } else {
                navigate(-1);
            }
        }
    });

    const deleteProjectHandler = catchAsync(async () => {
        await deleteProject(project.id);
    }, {
        onLoad: `Deleting project ${project.title}`,
        onSuccess: `Project ${project.title} deleted`,
        onError: `Deleting project ${project.title} failed`
    });


    const showProjectInviteSlug = () => {

        const copyInviteSlug = async (e) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(`http://localhost:3000/join-to-project/${project.inviteSlug}`);
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

    const selectMenuOptions = [
        {
            iconClass: "far fa-pen", text: "Edit", action: () => {
            }
        },
        {
            iconClass: "far fa-archive", text: "Archive", action: () => {
            }
        },
        {
            iconClass: "far fa-user", text: "Invite Link", action: showProjectInviteSlug
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
                wallpaperPicture={project.users.find(usr => usr.owner.id === user.id).background}
                className="project-wallpaper"
                darkLayerOpacity={0.5}
            />
            <div className="project-head-details">
                <div className="project-head-top">
                    <h3>{project.title}</h3>
                    <SelectMenu buttonAxis="v" options={selectMenuOptions} type="executable-options"/>
                </div>
                <div className="project-head-bottom">
                    <div className="project-head-bottom-left-side">
                        {project.schedule && (
                            <ScheduleProgressBar
                                createdTime={project.created}
                                deadTime={'Sun Feb 06 2022 13:59:24 GMT+0330 (Iran Standard Time)'}
                                width={180}
                            />
                        )}
                        <div className="project-labels">
                            {renderLabels()}
                        </div>
                    </div>
                    <div className="project-head-bottom-right-side">
                        <Members
                            axis="r"
                            compressed
                            width={35}
                            gap={15}
                            members={project.users}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectHeader;