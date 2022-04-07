import axios from "axios.instance";

export const fetchLabels = async () => {
    const result = await axios.get("/labels/");
    return result.data.results;
};

export const fetchLabelTasks = async (id) => {
    const tasksResult = await axios.get("/tasks/", {
        params: {
            label: id,
            completed: false,
        },
    });
    return tasksResult.data.results;
};

export const fetchLabelProjects = async (id) => {
    const projectsResult = await axios.get("/projects/", { params: { label: id } });
    return projectsResult.data.results;
};

export const deleteLabel = async (id) => {
    return await axios.delete(`/label/${id}`);
};

export const updateLabel = async ({ id, title }) => {
    const result = await axios.patch("/labels/", { title });
    return result.data;
};

export const createLabel = async (title) => {
    const result = await axios.post("/label/", { title });
    return result.data;
};

export const changePosition = async ({ id, newPosition, type }) => {
    return await axios.post(
        "/changeposition/",
        {
            obj: id,
            position: newPosition,
        },
        {
            params: { type },
        }
    );
};

export const fetchComments = async (id, task) => {
    const result = await axios.get(
        `/comments/?project=${id}${task ? "&task=" + task : ""}&ordering=-created`
    );
    return result.data.results;
};

export const createComment = async ({ id, data, uploadProgressHandler }) => {
    const result = await axios.post(`/project/${id}/comment/`, data, {
        onUploadProgress: uploadProgressHandler,
    });
    return result.data;
};

export const deleteComment = async (id) => {
    const result = await axios.delete(`/comment/${id}`);
    return result.data;
};

export const updateComment = async (id) => {
    const result = await axios.patch(`/comment/${id}`);
    return result.data;
};

export const fetchTimezones = async () => {
    const result = await axios.get("/timezones/");
    return result.data;
};
