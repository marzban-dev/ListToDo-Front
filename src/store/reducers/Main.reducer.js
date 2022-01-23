import * as Acts from "store/actions/Main.actions";
import {FindAndUpdateProperties} from "Utils/HelperFunctionsForObjects";
import {produce} from "immer";
import {SKELETON_OPTIONS, TOASTIFY_OPTIONS} from "config";

const initState = {
    isLoading: true,
    isRefreshing: false,
    labels: [],
    colors: [
        {id: 0, color: "transparent"},
        {id: 1, color: "#c96f6f"},
        {id: 2, color: "#60a3d9"},
        {id: 3, color: "#FFEA7193"},
    ],
    projects: [],
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case Acts.START_FETCH_DATA:
            return {...state, isLoading: true};
        case Acts.FINISH_FETCH_DATA:
            return {...state, isLoading: false};
        case Acts.FETCH_DATA_FAILED:
            return {...state, isLoading: false};
        case Acts.SET_DATA:
            return setDataReducer(state, action);
        case Acts.ADD_LABEL:
            return {...state, labels: [...state.labels, action.label]};
        case Acts.SET_LABEL_DATA:
            return setLabelDataReducer(state, action);
        case Acts.SET_APP_THEME:
            return setAppThemeReducer(state, action);
        default:
            return state;
    }
};

const setLabelDataReducer = (state, action) => {
    const copyOfLabels = state.labels;
    const labelIndex = copyOfLabels.findIndex(label => label.id === action.id);

    copyOfLabels[labelIndex].tasks = action.tasks;
    copyOfLabels[labelIndex].projects = action.projects;

    return {...state, labels: copyOfLabels};
}

const setAppThemeReducer = (state, action) => {
    let theme;

    if (action.themeName) {
        theme = action.themeName;
    } else {
        theme = localStorage.getItem('APP_THEME') ? localStorage.getItem('APP_THEME') : 'light';
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

const setDataReducer = (state, action) => {
    let dataToSet = {};

    if (action.hasOwnProperty('modify')) {
        const modifyOptions = {
            propertiesToSet: {},
            compareDeepChanges: true,
            deleteMatchedItem: false,
            ...action.modify
        }

        dataToSet[modifyOptions.part] = produce(state[modifyOptions.part], draft => {
            draft.forEach(FindAndUpdateProperties(
                modifyOptions.type,
                modifyOptions.id,
                modifyOptions.key,
                modifyOptions.data,
                modifyOptions.nestedProperties,
                modifyOptions.compareDeepChanges,
                modifyOptions.deleteMatchedItem
            ));
        });
    } else {
        dataToSet = {
            labels: action.labels ? action.labels : state.labels,
            colors: action.colors ? action.colors : state.colors,
            projects: action.projects ? action.projects : state.projects,
        };
    }

    return {...state, ...dataToSet};
};

export default reducer;
