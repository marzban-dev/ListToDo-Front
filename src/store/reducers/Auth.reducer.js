//
// const initState = {
//     isLoading: true,
//     isPreAuthLoading: true,
//     preAuth: false,
//     user: null,
//     isAuthFailed: false,
// };

// const reducer = (state = initState, action) => {
//     switch (action.type) {
//         case Acts.START_PRE_AUTH:
//             return {...state, preAuth: false, isPreAuthLoading: true};
//         case Acts.FINISH_PRE_AUTH:
//             return {...state, preAuth: true, isPreAuthLoading: false};
//         case Acts.START_AUTH_USER:
//             return {...state, isLoading: true};
//         case Acts.SET_AUTHENTICATED_USER:
//             return {...state, user: action.user};
//         case Acts.FINISH_AUTH_USER:
//             return {...state, isLoading: false, isAuthFailed: false};
//         case Acts.AUTH_USER_FAILED:
//             return {...state, isLoading: false, isAuthFailed: true};
//         case Acts.SET_SETTINGS:
//             return {...state, user: {...state.user, setting: action.settings}};
//         default:
//             return state;
//     }
// };

// export default reducer;
