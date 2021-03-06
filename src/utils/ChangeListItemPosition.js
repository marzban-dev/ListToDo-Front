import sortListItems from "utils/SortListItems";

export const changeListItemPosition = (oldIndex, newIndex, list) => {
    let copyOfList = [...list];
    const oldPosition = copyOfList[oldIndex].position;
    const newPosition = copyOfList[newIndex].position;

    if (oldPosition > newPosition) {
        const start = newPosition;
        const finish = oldPosition - 1;
        copyOfList.forEach((task, index) => {
            if (task.position >= start && task.position <= finish) {
                copyOfList[index] = {...copyOfList[index], position: task.position + 1};
            }
        })
    } else {
        const start = oldPosition + 1;
        const finish = newPosition;
        copyOfList.forEach((task, index) => {
            if (task.position >= start && task.position <= finish) {
                copyOfList[index] = {...copyOfList[index], position: task.position - 1};
            }
        })
    }

    copyOfList[oldIndex] = {...copyOfList[oldIndex], position: newPosition};

    return {list: sortListItems(copyOfList), newPosition};
};