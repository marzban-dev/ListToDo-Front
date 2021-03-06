import axios from "axios.instance";

export const fetchTasks = async (filter = {}) => {
    const result = await axios.get("/tasks/", {params: filter});
    return result.data.results;
};

export const fetchTask = async (id, filter = {}) => {
    const result = await axios.get(`/task/${id}`, {params: filter});
    return result.data;
};

export const createTask = async ({sectionId, data}) => {
    const copyOfData = {...data};
    copyOfData.assignee = copyOfData.assignee ? copyOfData.assignee.id : null;
    const result = await axios.post(`/section/${sectionId}/task/`, copyOfData);
    return result.data;
};

export const updateTask = async ({taskData, data}) => {
    const copyOfData = {...data};
    copyOfData.assignee = copyOfData.assignee ? copyOfData.assignee.id : null;
    const result = await axios.patch(`/task/${taskData.id}/`, copyOfData);
    return result.data;
};

export const deleteTask = async (task) => {
    await axios.delete(`/task/${task.id}/`);
};
