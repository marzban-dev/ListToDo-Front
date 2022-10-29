import * as Acts from "store/actions/Main.actions";
import {SKELETON_OPTIONS, TOASTIFY_OPTIONS} from "config";

const initState = {};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case Acts.SET_APP_THEME:
            return setAppThemeReducer(state, action);
        default:
            return state;
    }
};

const setAppThemeReducer = (state, action) => {
    let theme;

    if (action.themeName) {
        theme = action.themeName;
    } else {
        theme = localStorage.getItem('APP_THEME') ? localStorage.getItem('APP_THEME') : 'dark';
    }

    document.getElementsByTagName('body')[0].setAttribute('theme', theme);
    localStorage.setItem('APP_THEME', theme);
    TOASTIFY_OPTIONS.theme = theme;

    SKELETON_OPTIONS.backgroundColor =
        getComputedStyle(document.body).getPropertyValue("--color-react-loader-background")
    SKELETON_OPTIONS.foregroundColor =
        getComputedStyle(document.body).getPropertyValue("--color-react-loader-forground")

    return state;
}

export default reducer;
