import axios from "AxiosInstance";

export const START_FETCH_INBOX_DATA = "START_FETCH_INBOX_DATA";
export const FINISH_FETCH_INBOX_DATA = "FINISH_FETCH_INBOX_DATA";
export const FETCH_INBOX_DATA_FAILED = "FETCH_INBOX_DATA_FAILED";

export const START_REFRESH_INBOX_DATA = "START_REFRESH_INBOX_DATA";
export const FINISH_REFRESH_INBOX_DATA = "FINISH_REFRESH_INBOX_DATA";
export const REFRESH_INBOX_DATA_FAILED = "REFRESH_INBOX_DATA_FAILED";

export const SET_INBOX_DATA = "SET_INBOX_DATA";

export const startRefreshInboxData = () => ({ type: START_REFRESH_INBOX_DATA });
export const finishRefreshInboxData = () => ({
  type: FINISH_REFRESH_INBOX_DATA,
});
export const refreshInboxDataFailed = () => ({
  type: REFRESH_INBOX_DATA_FAILED,
});

export const startFetchInboxData = () => ({ type: START_FETCH_INBOX_DATA });
export const finishFetchInboxData = () => ({ type: FINISH_FETCH_INBOX_DATA });
export const fetchInboxDataFailed = () => ({ type: FETCH_INBOX_DATA_FAILED });
export const setInboxData = (inboxData) => ({
  type: SET_INBOX_DATA,
  ...inboxData,
});

export const refreshInboxData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(startRefreshInboxData());

      const sections = {};

      const inboxSections = await axios.get(
        `/sections/?project=${getState().inbox.project.id}`
      );

      inboxSections.data.results.forEach((section) => {
        sections[section.title] = { id: section.id, tasks: [] };
      });

      const tasks = await axios.get("/tasks/");

      tasks.data.results.forEach((task) => {
        sections[task.section.title].tasks.push(task);
      });

      dispatch(
        setInboxData({
          sections,
        })
      );
      dispatch(finishRefreshInboxData());
    } catch (err) {
      dispatch(refreshInboxDataFailed());
      throw new Error(err);
    }
  };
};

export const fetchInboxData = () => {
  return async (dispatch) => {
    try {
      dispatch(startFetchInboxData());

      let inboxProject = await axios.get("/projects/?project__title=inbox");

      inboxProject = inboxProject.data.results[0];
      const inboxProjectId = inboxProject.project.id;

      const sections = {};

      const inboxSections = await axios.get(
        `/sections/?project=${inboxProjectId}`
      );

      inboxSections.data.results.forEach((section) => {
        sections[section.title] = { id: section.id, tasks: [] };
      });

      const allTasks = await axios.get("/tasks/");

      allTasks.data.results.forEach((task) => {
        sections[task.section.title].tasks.push(task);
      });

      const allLabels = await axios.get("/labels");

      const allColors = await axios.get("/colors/");

      dispatch(
        setInboxData({
          sections,
          labels: allLabels.data.results,
          project: inboxProject.project,
          colors: allColors.data.results,
        })
      );
      dispatch(finishFetchInboxData());
    } catch (error) {
      if (error.toJSON().message === "Network Error") {
        const cachedDataInLocalStorage = localStorage.getItem("CACHED_OFFLINE");

        if (cachedDataInLocalStorage) {
          dispatch(setInboxData(JSON.parse(cachedDataInLocalStorage)));
        }

        dispatch(finishFetchInboxData());
      } else {
        dispatch(fetchInboxDataFailed());
        throw error;
      }
    }
  };
};
