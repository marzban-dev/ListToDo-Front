import * as Acts from "store/actions/Inbox.actions";

const initState = {
  isLoading: true,
  isRefreshing: false,
  sections: null,
  project: null,
  labels: null,
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
      return {
        ...state,
        sections: action.sections,
        project: action.project ? action.project : state.project,
        labels: action.labels ? action.labels : state.labels,
      };
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

export default reducer;
