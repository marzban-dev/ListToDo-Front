import axios from "axios.instance";

export const fetchLabels = async () => {
    const result = await axios.get("/labels/");
    return result.data.results;
};

export const fetchLabelTasks = async (id) => {
    const tasksResult = await axios.get("/tasks/", {params: {label: id}});
    return tasksResult.data.results
};

export const fetchLabelProjects = async (id) => {
    const projectsResult = await axios.get("/projects/", {params: {label: id}});
    return projectsResult.data.results;
};

export const deleteLabel = async (id) => {
    return await axios.delete(`/label/${id}`);
};

export const updateLabel = async ({id, title}) => {
    const result = await axios.patch("/labels/", {title});
    return result.data;
};

export const createLabel = async (title) => {
    const result = await axios.post("/label/", {title});
    return result.data;
};