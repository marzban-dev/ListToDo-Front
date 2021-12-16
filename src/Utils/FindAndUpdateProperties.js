import _ from "lodash";

const falsyCheck = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (value && typeof value === "object") return Object.keys(value).length === 0;
    return value;
}

const findAndUpdateProperties = (type, id, key, propertiesToSet, nestedProperties) => {
    return obj => {
        let objType = "";

        if (obj.hasOwnProperty('tasks')) objType = "section";
        if (obj.hasOwnProperty('section')) objType = "task";
        if (obj.hasOwnProperty('projects')) objType = "project";

        if (objType === type && obj[key] === id) {
            Object.keys(propertiesToSet).forEach(property => {
                if (obj.hasOwnProperty(property) && !falsyCheck(obj[property]) && Array.isArray(obj[property])) {
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

        } else {
            nestedProperties.forEach(property => {
                if (obj.hasOwnProperty(property) && obj[property]) {
                    obj[property].forEach(findAndUpdateProperties(type, id, key, propertiesToSet, nestedProperties));
                }
            })
        }
    }
}

export default findAndUpdateProperties;