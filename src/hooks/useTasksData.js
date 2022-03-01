import {useMutation, useQuery, useQueryClient} from "react-query";
import {createTask, deleteTask, fetchTask, fetchTasks, updateTask} from "apis/tasks.api";

export const useTasksQuery = (id, isSubTask, options) => {
    return useQuery(
        [isSubTask ? "sub-tasks" : "section-tasks", Number(id)],
        () => fetchTasks({
            section: !isSubTask ? id : null,
            task: isSubTask ? id : null,
            task__isnull: !isSubTask
        }),
        {initialData: null, ...options}
    );
};

export const useTaskQuery = (id, options) => {
    return useQuery(
        ["task", Number(id)],
        () => fetchTask(Number(id)),
        options
    );
};

export const useCreateTaskQuery = (parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];

    return useMutation(createTask, {
        onSuccess: (createdTask) => {
            queryClient.setQueryData(key, oldTasks => {
                console.log(oldTasks);
                return [...oldTasks, createdTask];
            })
        }
    });
};

export const useDeleteTaskQuery = (parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];

    return useMutation(deleteTask, {
        onMutate: async (id) => {
            await queryClient.cancelQueries(key);
            const previousTasksData = queryClient.getQueryData(key);
            queryClient.setQueryData(key, oldTasks => oldTasks.filter(task => task.id !== id))
            return {previousTasksData};
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(key, context.previousTasksData)
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        }
    });
};


export const useUpdateTaskQuery = (id, parentId, isSubTask) => {
    const queryClient = useQueryClient();
    const key = [isSubTask ? "sub-tasks" : "section-tasks", Number(parentId)];

    return useMutation(updateTask, {
        onMutate: async ({data: taskUpdatedData}) => {
            await queryClient.cancelQueries(["task", Number(id)]);
            const previousTasksData = queryClient.getQueryData(key);

            queryClient.setQueryData(["task", Number(id)], oldTask => {
                return {...oldTask, ...taskUpdatedData};
            })
            queryClient.setQueryData(key, oldTasks => {
                return oldTasks.map(task => {
                    if (task.id === id) return {...task, ...taskUpdatedData};
                    else return task;
                });
            })
            return {previousTasksData};
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(key, context.previousTasksData)
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        }
    });
};