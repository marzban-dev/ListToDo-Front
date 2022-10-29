import axios from "axios.instance";

export const fetchSections = async (filter = {}) => {
    const result = await axios.get("/section/", {params: filter});
    return result.data.results;
};

export const createSection = async (data) => {
    const result = await axios.post(`/section/`, {...data});
    return result.data;
};

export const deleteSection = async (id) => {
    await axios.delete(`/section/${id}/`);
}

export const updateSection = async ({id, data}) => {
    const result = await axios.patch(`/section/${id}/`, data);
    return result.data;
}

export const fetchArchivedSections = async () => {
    const result = await axios.get("/section/", {params: {archive: true}});
    return result.data.results;
}