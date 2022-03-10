import axios from "axios.instance";

export const fetchActivity = async ({pageParam = 1}) => {
    const result = await axios.get(`/activity/`, {
        params: {
            page: pageParam,
            offset: 20,
            ordering: "-created",
            pagination: true,
            lite: false
        }
    });
    return {
        list: result.data.results,
        count: result.data.count
    };
}

export const fetchActivityByRange = async (lteDate, gteDate) => {
    const result = await axios.get(`/activity/`, {
        params: {
            ordering: "-created",
            created__gte: gteDate,
            created__lte: lteDate,
            pagination: false,
            lite: true
        }
    });
    return result.data;
}