import {produce} from "immer";

const sortListItems = (list = [], key = "position") => {
    return produce(list, draft => {
        draft.sort((a, b) => a[key] - b[key])
    });
};

export default sortListItems;