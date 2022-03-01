import {useMutation, useQuery, useQueryClient} from "react-query";
import {createComment, deleteComment, fetchComments} from "apis/details.api";

export const useCommentsQuery = (id, task) => {
    return useQuery(
        [task ? "task-comments" : "project-comments", id],
        () => fetchComments(id, task),
        {initialData: null}
    );
}

export const useCreateCommentQuery = (id, task) => {
    const queryClient = useQueryClient();
    const key = [task ? "task-comments" : "project-comments", id];

    return useMutation(
        createComment, {
            onSuccess: (createdComment) => {
                queryClient.setQueryData(key, oldComments => [createdComment, ...oldComments])
            }
        }
    );
}

export const useDeleteCommentQuery = (parentId, isForTask) => {
    const queryClient = useQueryClient();
    const key = [isForTask ? "task-comments" : "project-comments", parentId];

    return useMutation(
        deleteComment, {
            onMutate: async (id) => {
                await queryClient.cancelQueries(key);
                const previousCommentsData = queryClient.getQueryData(key);
                queryClient.setQueryData(
                    key,
                    oldComments => {
                        if (oldComments) return oldComments.filter(comment => comment.id !== id);
                        else return oldComments;
                    }
                )
                return {previousCommentsData};
            },
            onError: (_error, _newLabel, context) => {
                queryClient.setQueryData(key, context.previousCommentsData)
            },
            onSettled: () => {
                queryClient.invalidateQueries(key);
            }
        }
    );
}