import * as Acts from "store/actions/Auth.actions";

const initState = {
    isLoading: true,
    preAuth: false,
    user: null,
    isAuthFailed: false,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case Acts.START_PRE_AUTH:
            return {...state, preAuth: false};
        case Acts.FINISH_PRE_AUTH:
            return {...state, preAuth: true};
        case Acts.START_AUTH_USER:
            return {...state, isLoading: true };
        case Acts.SET_AUTHENTICATED_USER:
            return {...state, user: action.user};
        case Acts.FINISH_AUTH_USER:
            return {...state, isLoading: false, isAuthFailed: false};
        case Acts.AUTH_USER_FAILED:
            return {...state, isLoading: false, isAuthFailed: true};
        default:
            return state;
    }
};

export default reducer;
