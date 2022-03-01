import axios from "axios.instance";

export const fetchInboxProject = async () => {
    const result = await axios.get("/projects/", {params: {project__project__isnull: true}});
    return result.data.results[0].project;
};

export const fetchProjects = async (filter = {}) => {
    const result = await axios.get("/projects/", {params: filter});
    return result.data.results;
};

export const fetchProject = async (id) => {
    const result = await axios.get(`/project/${id}/`);
    return result.data;
}

export const deleteProject = async (id) => {
    return await axios.delete(`/project/${id}/`);
}

export const updateProject = async (id) => {
    const result = await axios.patch(`/project/${id}/`, {});
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