import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    deleteProject,
    fetchInboxProject,
    fetchProject,
    fetchProjects,
    joinToProject,
    leaveProject
} from "apis/projects.api";

export const useInboxProjectQuery = (options) => {
    return useQuery(
        "inbox-project",
        fetchInboxProject,
        {
            initialData: null, ...options
        }
    );
}

export const useProjectsQuery = (id) => {
    return useQuery(
        ["projects", id],
        () => fetchProjects({project__project: id}),
        {initialData: null}
    );
};

export const useProjectQuery = (id, parentId) => {
    const queryClient = useQueryClient();

    return useQuery(
        ["project", id],
        () => fetchProject(id), {
            initialData: () => {
                const cachedProjects = queryClient.getQueryData(['projects', parentId]);
                return cachedProjects ? cachedProjects.find(prj => prj.id === id).project : null;
            }
        }
    );
};

export const useDeleteProjectQuery = (parentId, options) => {
    const queryClient = useQueryClient();

    return useMutation(
        deleteProject, {
            onMutate: async (id) => {
                await queryClient.cancelQueries(["project", id]);
                const previousProjectsData = queryClient.getQueryData(["projects", parentId]);
                queryClient.setQueryData(
                    ["projects", parentId],
                    oldProjects => {
                        if (oldProjects) return oldProjects.filter(prj => prj.id !== id);
                        else return oldProjects;
                    }
                )
                return {previousProjectsData};
            },
            onError: (_error, _newLabel, context) => {
                queryClient.setQueryData(["projects", parentId], context.previousProjectsData)
            },
            onSettled: () => {
                queryClient.invalidateQueries(["projects", parentId]);
            },
            ...options
        }
    );
};

export const useUpdateProjectQuery = (id) => {
    return useQuery(
        ["project", id],
        () => fetchProject(id)
    );
};

export const useJoinToProjectQuery = (inviteSlug) => {
    return useMutation(() => joinToProject(inviteSlug));
}

export const useLeaveProjectQuery = (id) => {
    return useMutation(() => leaveProject(id));
}