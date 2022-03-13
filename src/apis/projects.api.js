import axios from "axios.instance";

export const fetchInboxProject = async () => {
    const result = await axios.get("/projects/", {params: {project__project__isnull: true}});
    return result.data.results[0].project;
};

export const fetchAllProjects = async (parentId) => {
    const user = await axios.get("/myinfo/");

    const allProjects = await axios.get("/projects/");
    const jointProjects = allProjects.data.results.filter(prj => prj.project.owner.id !== user.data.id);

    const inboxProjects = await axios.get("/projects/", {
        params: {
            project__project: parentId
        }
    });

    return [...jointProjects, ...inboxProjects.data.results];
};

export const fetchProjects = async (filter = {}) => {
    const result = await axios.get("/projects/", {params: filter});
    return result.data.results;
};

export const fetchProject = async (id) => {
    const result = await axios.get(`/project/${id}/`);
    return result.data;
}

export const deleteProject = async (project) => {
    return await axios.delete(`/project/${project.id}/`);
}

export const updateProject = async ({data, personalizeData, projectData}) => {
    await axios.patch(`/project/${projectData.id}/`, data);
    const result = await axios.patch(`/project/${personalizeData.id}/personalize/`, {
        color: personalizeData.color,
        label: personalizeData.label
    });

    if (personalizeData.hasOwnProperty('background')) {
        const backgroundFormData = new FormData();
        backgroundFormData.append('background', personalizeData.background, personalizeData.background.name);
        const result = await axios.patch(`/project/${personalizeData.id}/personalize/`, backgroundFormData);
        return result.data;
    }

    return result.data;
}

export const createProject = async ({data, personalizeData}) => {
    const {data: createdProject} = await axios.post(`/project/`, data);
    const {data: user} = await axios.get("/myinfo/");
    console.log(user);
    const result = await axios.patch(
        `/project/${createdProject.users.find(usr => usr.owner.id === user.id).id}/personalize/`,
        {
            color: personalizeData.color,
            label: personalizeData.label
        }
    );

    if (personalizeData.hasOwnProperty('background')) {
        const backgroundFormData = new FormData();
        backgroundFormData.append('background', personalizeData.background, personalizeData.background.name);
        const result = await axios.patch(
            `/project/${createdProject.users.find(usr => usr.owner.id === user.id).id}/personalize/`,
            backgroundFormData
        );
        return result.data;
    }

    return result.data;
}

export const personalizeProject = async (id) => {
    const result = await axios.patch(`/project/${id}/personalize/`);
    return result.data;
}

export const joinToProject = async (inviteSlug) => {
    const result = await axios.post(`/project/invite/${inviteSlug}/`);
    return result.data;
}

export const leaveProject = async (id) => {
    const result = await axios.post(`/project/${id}/leave/`);
    return result.data;
}

export const changeProjectInviteSlug = async (id) => {
    const result = await axios.get(`/project/${id}/inviteslug/`);
    return result.data.inviteSlug;
}

export const fetchArchivedProjects = async () => {
    const result = await axios.get("/projects/", {params: {project__archive: true}});
    return result.data.results;
}