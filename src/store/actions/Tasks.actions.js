import axios from "AxiosInstance";
import { refreshInboxData } from "./Inbox.actions";

export const createSection = (projectId, data) => {
  return async (dispatch) => {
    try {
      await axios.post(`/project/${projectId}/section/`, data);
    } catch (error) {
      throw error;
    }
  };
};

export const createTask = (sectionId, data) => {
  console.log(data);
  return async (dispatch) => {
    try {
      await axios.post(`/section/${sectionId}/task/`, data);
    } catch (error) {
      throw error;
    }
  };
};

export const updateTask = (taskId, data) => {
  return async (dispatch) => {
    try {
      await axios.patch(`/task/${taskId}/`, data);
      await dispatch(refreshInboxData());
    } catch (error) {
      throw error;
    }
  };
};
