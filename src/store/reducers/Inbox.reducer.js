import * as Acts from "store/actions/Inbox.actions";

const initState = {
  isLoading: true,
  isRefreshing: false,
  sections: [],
  project: [null],
  labels: null,
  colors: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case Acts.START_FETCH_INBOX_DATA:
      return { ...state, isLoading: true };
    case Acts.FINISH_FETCH_INBOX_DATA:
      return { ...state, isLoading: false };
    case Acts.FETCH_INBOX_DATA_FAILED:
      return { ...state, isLoading: false };
    case Acts.SET_INBOX_DATA:
      return setInboxDataReducer(state, action);
    case Acts.START_REFRESH_INBOX_DATA:
      return { ...state, isRefreshing: true };
    case Acts.FINISH_REFRESH_INBOX_DATA:
      return { ...state, isRefreshing: false };
    case Acts.REFRESH_INBOX_DATA_FAILED:
      return { ...state, isRefreshing: false };
    default:
      return state;
  }
};

const setInboxDataReducer = (state, action) => {
  const dataToSet = {
    sections: action.sections,
    project: action.project ? action.project : state.project,
    labels: action.labels ? action.labels : state.labels,
    colors: action.colors ? action.colors : state.colors,
  };

  localStorage.setItem("CACHE_OFFLINE", JSON.stringify(dataToSet));
  
  return {...state,...dataToSet};
};

export default reducer;
