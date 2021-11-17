import axios from "AxiosInstance";

export const createSection = (projectId, data) => {
  return async (dispatch) => {
    try {
      const result = await axios.post(`/project/${projectId}/section/`, data);
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const createTask = (sectionId, data) => {
  return async (dispatch) => {
    try {
      const result = await axios.post(`/section/${sectionId}/task/`, data);
      console.log(result);
    } catch (err) {
      throw new Error(err);
    }
  };
};
