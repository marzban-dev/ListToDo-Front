import axios from "axios.instance";

export const fetchSections = async (filter = {}) => {
    const result = await axios.get("/sections/", {params: filter});
    return result.data.results;
};

export const createSection = async ({projectId, data}) => {
    const result = await axios.post(`/project/${projectId}/section/`, data);
    return result.data;
};

export const deleteSection = async (id) => {
    await axios.delete(`/section/${id}/`);
}

export const updateSection = async ({id, data}) => {
    const result = await axios.patch(`/section/${id}/`, data);
    return result.data;
}
