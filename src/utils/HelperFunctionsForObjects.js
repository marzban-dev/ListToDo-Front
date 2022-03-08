import _ from "lodash";

export const FindAndUpdateProperties = (
    type,
    id,
    key,
    propertiesToSet = {},
    nestedProperties,
    compareDeepChanges,
    deleteMatchedItem
) => {
    return (obj, index, currentArray) => {
        let objType = "";

        if (obj.hasOwnProperty('tasks')) objType = "section";
        if (obj.hasOwnProperty('section')) objType = "task";
        if (obj.hasOwnProperty('projects')) objType = "project";

        if (objType === type && obj[key] === id) {
            Object.keys(propertiesToSet).forEach(property => {
                if (obj.hasOwnProperty(property) && Array.isArray(obj[property]) && compareDeepChanges) {
                    obj[property] = _.values(
                        _.merge(
                            _.keyBy(obj[property] === null ? [] : obj[property], 'id'),
                            _.keyBy(
                                Array.isArray(propertiesToSet[property])
                                    ? (propertiesToSet.length === 0 ? [] : propertiesToSet[property])
                                    : [propertiesToSet[property]],
                                'id'
                            )
                        )
                    )
                } else {
                    obj[property] = propertiesToSet[property];
                }
            })

            if (deleteMatchedItem) currentArray.splice(index, 1);

        } else {
            nestedProperties.forEach(property => {
                if (obj.hasOwnProperty(property) && obj[property]) {
                    obj[property].forEach(
                        FindAndUpdateProperties(type, id, key, propertiesToSet, nestedProperties, compareDeepChanges, deleteMatchedItem)
                    );
                }
            })
        }
    }
}

export const FindAndReturnProperties = (arrayToIterate, type, id, key, propertiesToReturn = [], nestedProperties) => {

    let result = null;

    const wrapper = (arrayToIterate, type, id, key, propertiesToReturn, nestedProperties) => {
        for (let obj of arrayToIterate) {

            let objType = "";

            if (obj.hasOwnProperty('tasks')) objType = "section";
            if (obj.hasOwnProperty('section')) objType = "task";
            if (obj.hasOwnProperty('projects')) objType = "project";

            if (objType === type && obj[key] === id) {
                const extractedProperties = {};

                propertiesToReturn.forEach(property => {
                    if (obj.hasOwnProperty(property)) {
                        extractedProperties[property] = obj[property]
                    }
                })
                result = extractedProperties;
            } else {
                nestedProperties.forEach(property => {
                    if (obj.hasOwnProperty(property) && obj[property]) {
                        wrapper(obj[property], type, id, key, propertiesToReturn, nestedProperties)
                    }
                })
            }
        }
    }

    wrapper(arrayToIterate, type, id, key, propertiesToReturn, nestedProperties)

    return result;
}