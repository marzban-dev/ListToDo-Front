import React, {useState} from 'react';
import Modal from "react-modal";
import {REACT_MODAL_OPTIONS} from "config";
import {useNavigate, useParams} from "react-router-dom";
import {useCreateProjectQuery, useProjectQuery, useUpdateProjectQuery} from "hooks/useProjectsData";
import catchAsync from "utils/CatchAsync";
import SelectColor from "components/UI/SelectColor";
import SelectLabels from "components/UI/SelectLabels";
import SelectSchedule from "components/UI/SelectSchedule";
import Button from "components/UI/Button";
import LoadingWrapper from "components/UI/LoadingWrapper";
import {useQueryClient} from "react-query";
import ProfileWallpaper from "components/UI/ProfileWallpaper";
import DefaultWallpaperLight from "assets/img/wallpaper-placeholder-light.jpg";
import DefaultWallpaperDark from "assets/img/wallpaper-placeholder-dark.jpg";
import "./createUpdateProject.scss"

const CreateUpdateProject = ({mode}) => {
    const {projectId, parentId} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData('user');
    const appTheme = localStorage.getItem("APP_THEME");

    const [projectTitle, setProjectTitle] = useState("");
    const [projectLabels, setProjectLabels] = useState([]);
    const [projectColor, setProjectColor] = useState(null);
    const [projectSchedule, setProjectSchedule] = useState(null);
    const [projectWallpaper, setProjectWallpaper] = useState(
        appTheme === "light" ? DefaultWallpaperLight : DefaultWallpaperDark
    );
    const [newProjectWallpaper, setNewProjectWallpaper] = useState(null);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const labels = queryClient.getQueryData("labels");

    const {data: project} = useProjectQuery(Number(projectId), Number(parentId), {
        enabled: mode === "modify", onError: () => navigate('/404')
    });

    const {mutateAsync: updateProject} = useUpdateProjectQuery(Number(parentId));
    const {mutateAsync: createProject} = useCreateProjectQuery(Number(parentId));

    if (!!project && projectTitle.length === 0) {
        setProjectTitle(project.title);
        setProjectSchedule(project.schedule ? new Date(project.schedule) : null);
        setProjectLabels(project.users.find(usr => usr.owner.id === user.id).label);
        setProjectColor(project.users.find(usr => usr.owner.id === user.id).color);
        setProjectWallpaper(
            project.users.find(usr => usr.owner.id === user.id).background
                ? project.users.find(usr => usr.owner.id === user.id).background
                : appTheme === "light" ? DefaultWallpaperLight : DefaultWallpaperDark
        );
    }

    const setNewWallpaper = (e) => {
        if (e.target.files.length > 0) {
            setNewProjectWallpaper(e.target.files[0]);
            const pic = URL.createObjectURL(e.target.files[0]);
            setProjectWallpaper(pic);
        }
    }

    const onTitleChanged = (e) => setProjectTitle(e.target.value);

    const onSubmitBtnClicked = catchAsync(async () => {
        setIsSubmitButtonDisabled(true);

        const dataObject = {
            title: projectTitle,
            schedule: projectSchedule,
            project: parentId
        };

        const personalizeDataToUpdate = {
            label: projectLabels,
            color: projectColor,
            id: project && project.users.find(usr => usr.owner.id === user.id).id
        };

        if (newProjectWallpaper) personalizeDataToUpdate['background'] = newProjectWallpaper;

        if (mode === 'create') {
            await createProject({
                data: dataObject,
                personalizeData: personalizeDataToUpdate,
            });
            setIsSubmitButtonDisabled(false)
        } else {
            await updateProject({
                data: dataObject,
                personalizeData: personalizeDataToUpdate,
                projectData: project
            });
            setIsSubmitButtonDisabled(false);
        }
    }, mode === 'modify' ? {
        onLoad: `Updating project ${projectTitle}`,
        onSuccess: `Project ${projectTitle} updated`,
        onError: `Updating project ${projectTitle} failed`
    } : {
        onLoad: `Creating project ${projectTitle}`,
        onSuccess: `Project ${projectTitle} created`,
        onError: `Creating project ${projectTitle} failed`
    }, () => setIsSubmitButtonDisabled(false))

    const onEnterKeyPressed = (e) => e.key === "Enter" ? onSubmitBtnClicked() : null;

    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => navigate(-1), REACT_MODAL_OPTIONS.closeTimeoutMS)
    }

    const modalContent = (<React.Fragment>
        <div className="create-project-head-wallpaper-container">
            <ProfileWallpaper
                wallpaperPicture={projectWallpaper}
                className="create-project-head-wallpaper"
                darkLayerOpacity={appTheme === "light" ? 0.7 : 0.5}
            />
            <input
                type="file"
                onChange={setNewWallpaper}
                accept="image/*"
                id="project-wallpaper-picture"
                hidden
            />
            <label htmlFor="project-wallpaper-picture">
                <Button
                    onClick={() => document.getElementById('project-wallpaper-picture').click()}
                    iconClass="far fa-pen"
                    circleShape
                    size="xs"
                />
            </label>
        </div>
        <div className="create-project-content col-12">
            <div className="create-project-head-wrapper">
                <input
                    type="text"
                    placeholder="Title"
                    className="title-input col-11"
                    onChange={onTitleChanged}
                    value={projectTitle}
                />
                <div className="head-wrapper-separator col-1">
                    <SelectColor color={projectColor} setColor={setProjectColor}/>
                </div>
            </div>
            <SelectLabels labelsList={projectLabels} setLabelsList={setProjectLabels} labels={labels}/>
            <div className="create-project-save col-12">
                <div className="col-10">
                    <SelectSchedule
                        schedule={projectSchedule}
                        setSchedule={setProjectSchedule}
                    />
                </div>
                <Button
                    onClick={!isSubmitButtonDisabled ? onSubmitBtnClicked : null}
                    circleShape
                    size="md"
                    iconClass="far fa-check"
                />
            </div>
        </div>
    </React.Fragment>);

    return (<Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        {...REACT_MODAL_OPTIONS}

    >
        <div
            className="create-project-modal"
            onKeyPress={(e) => !isSubmitButtonDisabled ? onEnterKeyPressed(e) : null}
        >
            {mode === "modify" ? (<LoadingWrapper show={(!!project)} type="dots" size="sm">
                {modalContent}
            </LoadingWrapper>) : modalContent}
        </div>
    </Modal>);
}

export default CreateUpdateProject;