import * as Acts from "store/actions/Projects.actions";

const initState = {
    isLoading: false,
    all: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case Acts.START_FETCH_PROJECTS:
            return { ...state, isLoading: true };
        case Acts.FINISH_FETCH_PROJECTS:
            return { ...state, isLoading: false };
        case Acts.FETCH_PROJECTS_FAILED:
            return { ...state, isLoading: false };
        case Acts.SET_PROJECTS:
            return { ...state, all: action.projects }
        default:
            return state;
    }
};

export default reducer;