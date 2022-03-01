import {fetchLabels, fetchLabelTreeData, fetchProjects} from "./ApiCalls.actions";

export const START_FETCH_DATA = "START_FETCH_DATA";
export const FINISH_FETCH_DATA = "FINISH_FETCH_DATA";
export const FETCH_DATA_FAILED = "FETCH_DATA_FAILED";
export const SET_DATA = "SET_DATA";
export const ADD_LABEL = "ADD_LABEL";
export const SET_LABEL_DATA = "SET_LABEL_DATA";
export const SET_APP_THEME = "SET_APP_THEME";

export const startFetchData = () => ({type: START_FETCH_DATA});
export const finishFetchData = () => ({type: FINISH_FETCH_DATA});
export const fetchDataFailed = () => ({type: FETCH_DATA_FAILED});
export const setData = (data) => ({type: SET_DATA, ...data});
export const addLabel = (label) => ({type: ADD_LABEL, label});
export const setLabelData = (id, data) => ({type: SET_LABEL_DATA, id, ...data});

export const refreshLabelData = () => {
    return async (dispatch, getState) => {
        const labels = getState().main.labels;
        try {
            for (const label in labels) {
                const {tasks, projects} = await dispatch(fetchLabelTreeData(labels[label].id));
                dispatch(setLabelData(labels[label].id, {tasks, projects}))
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

export const setAppTheme = (themeName = null) => ({type: SET_APP_THEME, themeName})

export const fetchData = () => {
    return async (dispatch) => {
        try {
            dispatch(startFetchData());

            let projects = await dispatch(fetchProjects({project__project__isnull: true}));

            const labels = await dispatch(fetchLabels());

            // const colors = await dispatch(fetchColors());

            dispatch(setData({projects, labels}));

            dispatch(finishFetchData())
        } catch (error) {
            dispatch(fetchDataFailed());
            console.log(error);
            throw error;
        }
    };
};

/**
 * This action change position of ( Task - Section - Project )
 *  @param {string} parentType - type of parent that contain the item [ task - section - project ]
 *  @param {string} itemType - type of item that should be changed [ task - section - project ]
 *  @param {string} containerName
 *  @param {number} id
 *  @param {number} oldIndex
 *  @param {number} newIndex
 *  @param {Array} list - a list that needs to be changed
 * **/
//
// export const changePosition = (parentType, itemType, containerName, id, oldIndex, newIndex, list) => {
//     return async (dispatch) => {
//         try {
//             let copyOfList = [...list];
//             const oldPosition = copyOfList[oldIndex].position;
//             const newPosition = copyOfList[newIndex].position;
//             const itemId = copyOfList[oldIndex].id;
//
//             if (oldPosition > newPosition) {
//                 const start = newPosition;
//                 const finish = oldPosition - 1;
//                 copyOfList.forEach((task, index) => {
//                     if (task.position >= start && task.position <= finish) {
//                         copyOfList[index] = {...copyOfList[index], position: task.position + 1};
//                     }
//                 })
//             } else {
//                 const start = oldPosition + 1;
//                 const finish = newPosition;
//                 copyOfList.forEach((task, index) => {
//                     if (task.position >= start && task.position <= finish) {
//                         copyOfList[index] = {...copyOfList[index], position: task.position - 1};
//                     }
//                 })
//             }
//
//             copyOfList[oldIndex] = {...copyOfList[oldIndex], position: newPosition};
//
//             const sortedList = sortListItems(copyOfList);
//
//             const data = {};
//             data[containerName] = sortedList;
//
//             dispatch(setData({
//                 modify: {
//                     type: parentType,
//                     part: 'projects',
//                     id,
//                     key: 'id',
//                     data,
//                     nestedProperties: ['projects', 'sections', 'tasks'],
//                     compareDeepChanges: false
//                 }
//             }));
//
//             await axios.post("/changeposition/", {
//                 obj: itemId,
//                 position: newPosition
//             }, {
//                 params: {type: itemType},
//             });
//
//         } catch (error) {
//             throw error;
//         }
//     };
// };
