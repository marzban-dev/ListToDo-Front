import axios from "axios.instance";

export const START_FETCH_PROJECTS = "START_FETCH_PROJECTS";
export const FINISH_FETCH_PROJECTS = "FINISH_FETCH_PROJECTS";
export const FETCH_PROJECTS_FAILED = "FETCH_PROJECTS_FAILED";
export const SET_PROJECTS = "SET_PROJECTS";

export const startFetchProjects = () => ({ type: START_FETCH_PROJECTS });
export const finishFetchProjects = () => ({ type: FINISH_FETCH_PROJECTS });
export const fetchProjectsFailed = () => ({ type: FETCH_PROJECTS_FAILED });
export const setProjects = (projects) => ({ type: SET_PROJECTS, projects });

export const fetchAllProjects = () => {
  return async (dispatch) => {
    try {
      dispatch(startFetchProjects());

      const response = await axios.get("/projects");

      let projects = response.data.results;
      projects.sort((a, b) => (a.position > b.position ? 1 : -1));

      dispatch(setProjects(projects));
      dispatch(finishFetchProjects());
    } catch (err) {
      console.log(err);
      dispatch(fetchProjectsFailed());
    }
  };
};

export const updateProjectPosition = (projectId, position) => {
  return async (dispatch) => {
    const result = await axios.patch(`/project/${projectId}/`, {
      position,
    });
  };
};
