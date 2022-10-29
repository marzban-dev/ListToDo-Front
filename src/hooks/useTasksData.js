import { useMutation, useQuery, useQueryClient } from "react-query";
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from "apis/tasks.api";

export const useTasksQuery = (id, isSubTask, options) => {
    return useQuery(
        [isSubTask ? "sub-tasks" : "section-tasks", Number(id)],
        () =>
            fetchTasks({
                section: !isSubTask ? id : null,
                task: isSubTask ? id : null,
                task__isnull: !isSubTask,
                completed: false,
            }),
        {
            refetchOnWindowFocus: false,
            ...options,
        }
    );
};

export const useCompletedTasksQuery = () => {
    return useQuery("completed-tasks", () => fetchTasks({ completed: true }), {
        refetchOnWindowFocus: false,
    });
};

export const useTaskQuery = (id, options) => {
    return useQuery(["task", Number(id)], () => fetchTask(Number(id)), {
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useCreateTaskQuery = (parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];

    return useMutation(createTask, {
        onSuccess: (createdTask) => {
            queryClient.setQueryData(key, (oldTasks) => {
                return [...oldTasks, createdTask];
            });
        },
    });
};

export const useDeleteTaskQuery = (parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];

    return useMutation(deleteTask, {
        onMutate: async (taskData) => {
            await queryClient.cancelQueries(key);
            const previousTasksData = queryClient.getQueryData(key);
            const previousLabelsData = [];

            const deleteTaskFromLabels = (task) => {
                task.label.forEach((lbl) => {
                    const previousLabelData = queryClient.getQueryData(["label-tasks", lbl.id]);
                    previousLabelsData.push({
                        key: ["label-tasks", lbl.id],
                        data: previousLabelData,
                    });
                    queryClient.setQueryData(["label-tasks", lbl.id], (oldLabelTasks) => {
                        if (oldLabelTasks) {
                            return oldLabelTasks.filter((task) => task.id !== taskData.id);
                        } else return oldLabelTasks;
                    });
                });
            };

            queryClient.setQueryData(key, (oldTasks) => {
                deleteTaskFromLabels(taskData);
                if (oldTasks) {
                    return oldTasks.filter((task) => task.id !== taskData.id);
                } else return oldTasks;
            });

            queryClient.setQueryData("completed-tasks", (oldTasks) => {
                if (oldTasks) {
                    return oldTasks.filter((task) => task.id !== taskData.id);
                } else return oldTasks;
            });

            return { previousTasksData, previousLabelsData };
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(key, context.previousTasksData);
            context.previousLabelsData.forEach((previousLabelData) => {
                queryClient.setQueryData(previousLabelData.key, previousLabelData.data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });
};

export const useUpdateTaskQuery = (parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];
    const previousLabelsData = [];

    return useMutation(updateTask, {
        onMutate: async ({ taskData, data: taskUpdatedData }) => {
            await queryClient.cancelQueries(["task", taskData.id]);
            const previousTasksData = queryClient.getQueryData(key);

            const updateTaskInLabels = (task) => {
                task.label.forEach((lbl) => {
                    const previousLabelData = queryClient.getQueryData(["label-tasks", lbl.id]);
                    previousLabelsData.push({
                        key: ["label-tasks", lbl.id],
                        data: previousLabelData,
                    });
                    queryClient.setQueryData(["label-tasks", lbl.id], (oldLabelTasks) => {
                        if (oldLabelTasks) {
                            return oldLabelTasks.map((task) => {
                                if (task.id === taskData.id) return { ...task, ...taskUpdatedData };
                                else return task;
                            });
                        } else return oldLabelTasks;
                    });
                });
            };

            queryClient.setQueryData(key, (oldTasks) => {
                updateTaskInLabels(taskData);

                if (oldTasks) {
                    return oldTasks.map((task) => {
                        if (task.id === taskData.id) return { ...task, ...taskUpdatedData };
                        else return task;
                    });
                } else return oldTasks;
            });

            queryClient.setQueryData("completed-tasks", (oldTasks) => {
                if (oldTasks) {
                    return oldTasks
                        .map((task) => {
                            if (task.id === taskData.id) return { ...task, ...taskUpdatedData };
                            else return task;
                        })
                        .filter((task) => task.completed === true);
                } else return oldTasks;
            });

            return { previousTasksData, previousLabelsData };
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(key, context.previousTasksData);
            context.previousLabelsData.forEach((previousLabelData) => {
                queryClient.setQueryData(previousLabelData.key, previousLabelData.data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });
};
