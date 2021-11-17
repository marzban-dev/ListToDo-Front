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
export const setInboxData = (sections, labels, project) => ({
  type: SET_INBOX_DATA,
  sections,
  project,
  labels,
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
        sections[section.title] = [];
      });

      const allTasks = await axios.get("/tasks/");

      allTasks.data.results.forEach((task) => {
        sections[task.section.title].push(task);
      });

      dispatch(setInboxData(sections));
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

      const inboxProject = await axios.get("/projects/?title=inbox");
      const inboxProjectId = inboxProject.data.results[0].id;

      const sections = {};

      const inboxSections = await axios.get(
        `/sections/?project=${inboxProjectId}`
      );

      inboxSections.data.results.forEach((section) => {
        sections[section.title] = [];
      });

      const allTasks = await axios.get("/tasks/");

      allTasks.data.results.forEach((task) => {
        sections[task.section.title].push(task);
      });

      const allLabels = await axios.get("/labels");

      dispatch(
        setInboxData(
          sections,
          allLabels.data.results,
          inboxProject.data.results[0]
        )
      );
      dispatch(finishFetchInboxData());
    } catch (err) {
      dispatch(fetchInboxDataFailed());
      throw new Error(err);
    }
  };
};
