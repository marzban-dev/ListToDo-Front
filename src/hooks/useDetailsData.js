import {useMutation, useQuery, useQueryClient} from "react-query";
import {createLabel, deleteLabel, fetchLabelProjects, fetchLabels, fetchLabelTasks} from "apis/details.api";

export const useLabelsQuery = (options) => {
    return useQuery(
        "labels",
        fetchLabels,
        {
            ...options
        }
    );
};

export const useLabelTasksQuery = (labelId) => {
    return useQuery(
        ["label-tasks", labelId],
        () => fetchLabelTasks(labelId),
        {
            initialData: null
        }
    );
};

export const useLabelProjectsQuery = (labelId) => {
    return useQuery(
        ["label-projects", labelId],
        () => fetchLabelProjects(labelId),
        {
            initialData: null
        }
    );
};

export const useCreateLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(createLabel, {
        onSuccess: (createdLabel) => {
            queryClient.setQueryData("labels", oldLabels => {
                return [...oldLabels, createdLabel];
            })
        }
    });
};

export const useUpdateLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(createLabel, {
        onMutate: async ({id, title}) => {
            await queryClient.cancelQueries("labels");
            const previousLabelsData = queryClient.getQueryData("labels");

            queryClient.setQueryData('labels', oldLabels => {
                const labelToUpdateIndex = oldLabels.findIndex(label => label.id === id);
                const copyOfOldLabels = [...oldLabels];
                copyOfOldLabels[labelToUpdateIndex].title = title;
                return copyOfOldLabels;
            })

            return {previousLabelsData};
        },
        onError: (_error, _newLabel, context) => {
            queryClient.setQueryData("labels", context.previousLabelsData)
        },
        onSettled: () => {
            queryClient.invalidateQueries("labels");
        }
    });
};

export const useDeleteLabelQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteLabel, {
        onMutate: async (id) => {
            await queryClient.cancelQueries("labels");
            const previousLabelsData = queryClient.getQueryData("labels");

            queryClient.setQueryData('labels', oldLabels => {
                const labelToDeleteIndex = oldLabels.findIndex(label => label.id === id);
                const copyOfOldLabels = [...oldLabels];
                copyOfOldLabels.splice(labelToDeleteIndex, 1);
                return copyOfOldLabels;
            })

            return {previousLabelsData};
        },
        onError: (_error, _newLabel, context) => {
            queryClient.setQueryData("labels", context.previousLabelsData)
        },
        onSettled: () => {
            queryClient.invalidateQueries("labels");
        }
    });
};