import axios from "AxiosInstance";

//**************************************
// Api for tasks --------------------- *
//**************************************

export const fetchTasks = (filter = {}) => {
    return async (dispatch) => {
        try {
            const result = await axios.get("/tasks/", {
                params: {...filter}
            });
            return result.data.results.map(task => ({...task, tasks: null}))
        } catch (error) {
            throw error;
        }
    };
};

export const createTask = (sectionId, data) => {
    return async (dispatch) => {
        try {
            const result = await axios.post(`/section/${sectionId}/task/`, data);
            return {...result.data, tasks: []};
        } catch (error) {
            throw error;
        }
    };
};

export const updateTask = (taskId, data) => {
    return async (dispatch) => {
        try {
            const result = await axios.patch(`/task/${taskId}/`, data);
            return result.data;
        } catch (error) {
            throw error;
        }
    };
};

export const deleteTask = (taskId) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/task/${taskId}/`);
        } catch (error) {
            throw error;
        }
    };
};

//**************************************
// Api for sections ------------------ *
//**************************************

export const fetchSections = (filter = {}) => {
    return async (dispatch) => {
        try {
            const result = await axios.get("/sections/", {
                params: {
                    ...filter,
                },
            });
            return result.data.results.map(sec => ({...sec, tasks: null}))
        } catch (error) {
            throw error;
        }
    };
};

export const createSection = (projectId, data) => {
    return async (dispatch) => {
        try {
            const result = await axios.post(
                `/project/${projectId}/section/`,
                data
            );

            return {...result.data, tasks: []};
        } catch (error) {
            throw error;
        }
    };
};

export const deleteSection = (sectionId) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/section/${sectionId}/`);
        } catch (error) {
            throw error;
        }
    }
}

export const updateSection = (sectionId, data) => {
    return async (dispatch) => {
        try {
            const result = await axios.patch(`/section/${sectionId}/`, data);
            return result.data;
        } catch (error) {
            throw error;
        }
    }
}

//**************************************
// Api for colors   ------------------ *
//**************************************

export const fetchColors = (filter = {}) => {
    return async (dispatch) => {
        try {
            const result = await axios.get("/colors/", {
                params: {
                    ...filter,
                },
            });
            return result.data.results;
        } catch (error) {
            throw error;
        }
    };
};

//**************************************
// Api for labels   ------------------ *
//**************************************

export const fetchLabels = (filter = {}) => {
    return async (dispatch) => {
        try {
            const result = await axios.get("/labels/", {
                params: {
                    ...filter,
                },
            });
            return result.data.results;
        } catch (error) {
            throw error;
        }
    };
};

export const createLabel = (title) => {
    return async (dispatch) => {
        try {
            const result = await axios.post("/label/", {title});
            return result.data;
        } catch (error) {
            throw error;
        }
    };
};

//**************************************
// Api for projects   ---------------- *
//**************************************

export const fetchProjects = (filter = {}) => {
    return async (dispatch, getState) => {
        try {
            const result = await axios.get("/projects/", {
                params: {
                    ...filter,
                },
            });

            return result.data.results.map(prj => ({...prj, sections: null, projects: null}));
        } catch (error) {
            throw error;
        }
    };
};

