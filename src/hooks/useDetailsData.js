import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "react-query";
import {changePosition, createLabel, deleteLabel, fetchLabelProjects, fetchLabels, fetchLabelTasks, fetchTimezones,} from "apis/details.api";
import {fetchActivity, fetchActivityByRange} from "apis/activity.api";

export const useLabelsQuery = (options) => {
    return useQuery("labels", fetchLabels, options);
};

export const useLabelTasksQuery = (labelId) => {
    return useQuery(["label-tasks", labelId], () => fetchLabelTasks(labelId));
};

export const useLabelProjectsQuery = (labelId) => {
    return useQuery(["label-projects", labelId], () => fetchLabelProjects(labelId));
};

export const useCreateLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(createLabel, {
        onSuccess: (createdLabel) => {
            queryClient.setQueryData("labels", (oldLabels) => {
                return [...oldLabels, createdLabel];
            });
        },
    });
};

export const useUpdateLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(createLabel, {
        onMutate: async ({ id, title }) => {
            await queryClient.cancelQueries("labels");
            const previousLabelsData = queryClient.getQueryData("labels");

            queryClient.setQueryData("labels", (oldLabels) => {
                const labelToUpdateIndex = oldLabels.findIndex((label) => label.id === id);
                const copyOfOldLabels = [...oldLabels];
                copyOfOldLabels[labelToUpdateIndex].title = title;
                return copyOfOldLabels;
            });

            return { previousLabelsData };
        },
        onError: (_error, _newLabel, context) => {
            queryClient.setQueryData("labels", context.previousLabelsData);
        },
        onSettled: () => {
            queryClient.invalidateQueries("labels");
        },
    });
};

export const useDeleteLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteLabel, {
        onMutate: async (id) => {
            await queryClient.cancelQueries("labels");
            const previousLabelsData = queryClient.getQueryData("labels");

            queryClient.setQueryData("labels", (oldLabels) =>
                oldLabels.filter((label) => label.id !== id)
            );

            return { previousLabelsData };
        },
        onError: (_error, _newLabel, context) => {
            queryClient.setQueryData("labels", context.previousLabelsData);
        },
        onSettled: () => {
            queryClient.invalidateQueries("labels");
        },
    });
};

export const useChangePositionQuery = (key) => {
    const queryClient = useQueryClient();
    return useMutation(changePosition, {
        onMutate: async ({ list }) => {
            await queryClient.cancelQueries(key);
            const previousData = queryClient.getQueryData(key);
            queryClient.setQueryData(key, list);
            return { previousData };
        },
        onError: (_error, _newLabel, context) => {
            queryClient.setQueryData(key, context.previousLabelsData);
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });
};

export const useActivityQuery = () => {
    return useInfiniteQuery(["activities"], fetchActivity, {
        getNextPageParam: (_lastPage, pages) => {
            return pages.length + 1;
        },
    });
};

export const useChartActivityQuery = (gte, lte, options) => {
    return useQuery(
        [
            "chart-activities",
            `${new Date(gte).toLocaleDateString()}-${new Date(lte).toLocaleDateString()}`,
        ],
        () => fetchActivityByRange(lte, gte),
        options
    );
};

export const useTimezonesQuery = () => {
    return useQuery("chart-activities", fetchTimezones);
};
