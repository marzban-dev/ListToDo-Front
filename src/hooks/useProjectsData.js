import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    changeProjectInviteSlug,
    createProject,
    deleteProject,
    fetchAllProjects,
    fetchArchivedProjects,
    fetchInboxProject,
    fetchProject,
    fetchProjects,
    joinToProject,
    leaveProject,
    updateProject
} from "apis/projects.api";

export const useInboxProjectQuery = (options) => {
    return useQuery(
        "inbox-project",
        fetchInboxProject,
        options
    );
}

export const useAllProjectsQuery = (id) => {
    return useQuery(
        ["projects", id],
        () => fetchAllProjects(id)
    );
};

export const useProjectsQuery = (id) => {
    return useQuery(
        ["projects", id],
        () => fetchProjects({project__project: id})
    );
};

export const useProjectQuery = (id, parentId, options) => {
    return useQuery(
        ["project", id],
        () => fetchProject(id),
        options
    );
};

export const useDeleteProjectQuery = (parentId, options) => {
    const queryClient = useQueryClient();

    return useMutation(
        deleteProject, {
            onMutate: async (projectData) => {
                await queryClient.cancelQueries(["project", projectData.id]);
                const previousProjectsData = queryClient.getQueryData(["projects", parentId]);
                const previousLabelsData = [];

                const deleteProjectFromLabels = (project) => {
                    project.label.forEach(lbl => {
                        const previousLabelData = queryClient.getQueryData(['label-projects', lbl.id])
                        previousLabelsData.push({
                            key: ['label-projects', lbl.id],
                            data: previousLabelData
                        })
                        queryClient.setQueryData(['label-projects', lbl.id], oldLabelProjects => {
                            if (oldLabelProjects) {
                                return oldLabelProjects.filter(task => task.id !== projectData.id);
                            } else return oldLabelProjects;
                        });
                    });
                }

                queryClient.setQueryData(
                    ["projects", parentId],
                    oldProjects => {
                        deleteProjectFromLabels(projectData);
                        if (oldProjects) return oldProjects.filter(prj => prj.project.id !== projectData.id);
                        else return oldProjects;
                    }
                )
                return {previousProjectsData, previousLabelsData};
            },
            onError: (_error, _newLabel, context) => {
                queryClient.setQueryData(["projects", parentId], context.previousProjectsData);
                context.previousLabelsData.forEach(previousLabelData => {
                    queryClient.setQueryData(previousLabelData.key, previousLabelData.data);
                });
            },
            onSettled: async (_data, _error, variables) => {
                await queryClient.invalidateQueries(["project", variables.id]);
                await queryClient.invalidateQueries(["projects", parentId]);
            },
            ...options
        }
    );
};

export const useUpdateProjectQuery = (parentId, options) => {
    const queryClient = useQueryClient();

    return useMutation(updateProject, {
        onMutate: async ({projectData, personalizeData, data: projectUpdatedData}) => {
            const user = queryClient.getQueryData("user");
            await queryClient.cancelQueries(["project", Number(projectData.id)]);
            const previousProjectData = queryClient.getQueryData(["project", Number(projectData.id)]);
            const previousProjectsData = queryClient.getQueryData(["projects", Number(parentId)]);
            const previousArchivedProjectsData = queryClient.getQueryData("archived-projects");
            const previousLabelsData = [];

            const newPersonalData = {
                label: personalizeData.label,
                color: personalizeData.color
            };

            newPersonalData.label.forEach(lbl => {
                const previousLabelData = queryClient.getQueryData(['label-projects', Number(lbl)])
                previousLabelsData.push({
                    key: ['label-projects', Number(lbl)],
                    data: previousLabelData
                })
                queryClient.setQueryData(['label-projects', Number(lbl)], oldLabelProjects => {
                    if (oldLabelProjects) {

                        return oldLabelProjects.map(project => {
                            if (project.id === projectData.id) {
                                return {
                                    ...project,
                                    ...newPersonalData,
                                    project: {
                                        ...project.project,
                                        ...projectUpdatedData
                                    }
                                };
                            } else return project;
                        });
                    } else return oldLabelProjects;
                });
            });

            queryClient.setQueryData(["projects", Number(parentId)], oldProjects => {
                if (oldProjects) {
                    return oldProjects.map(project => {
                        if (project.project.id === projectData.id) {
                            return {
                                ...project,
                                ...newPersonalData,
                                project: {
                                    ...project.project,
                                    ...projectUpdatedData
                                }
                            };
                        } else return project;
                    });
                } else return oldProjects;
            });

            queryClient.setQueryData(["project", Number(projectData.id)], oldProject => {
                if (oldProject) {
                    const userToUpdateIndex = oldProject.users.findIndex(usr => usr.owner.id === user.id);
                    const copyOfUsersData = [...oldProject.users];
                    copyOfUsersData[userToUpdateIndex] = {
                        ...copyOfUsersData[userToUpdateIndex],
                        ...newPersonalData
                    }
                    return {
                        ...oldProject,
                        ...projectUpdatedData,
                        users: copyOfUsersData
                    };
                } else return oldProject;
            });
            if (projectUpdatedData.hasOwnProperty('archive')) {
                queryClient.setQueryData("archived-projects", oldArchivedProjects => {
                    if (oldArchivedProjects) return oldArchivedProjects.filter(prj => prj.project.id !== projectData.id)
                    else return oldArchivedProjects;
                });
            }

            return {previousProjectsData, previousArchivedProjectsData, previousLabelsData, previousProjectData};
        },
        onError: (_error, variables, context) => {
            queryClient.setQueryData(["project", Number(variables.projectData.id)], context.previousProjectData);
            queryClient.setQueryData(["projects", Number(parentId)], context.previousProjectsData);
            queryClient.setQueryData("archived-projects", context.previousArchivedProjectsData);
            context.previousLabelsData.forEach(previousLabelData => {
                queryClient.setQueryData(previousLabelData.key, previousLabelData.data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["projects", Number(parentId)]);
        },
        ...options
    })
};

export const useCreateProjectQuery = (parentId) => {
    const queryClient = useQueryClient();

    return useMutation(createProject, {
        onSuccess: (createdProject) => {
            queryClient.setQueryData(["projects", Number(parentId)], oldProjects => {
                return [...oldProjects, createdProject];
            })
        }
    })
};

export const useJoinToProjectQuery = (inviteSlug) => {
    return useMutation(() => joinToProject(inviteSlug));
}

export const useLeaveProjectQuery = (id) => {
    return useMutation(() => leaveProject(id));
}

export const useChangeProjectInviteQuery = (id) => {
    const queryClient = useQueryClient();

    return useMutation(() => changeProjectInviteSlug(id), {

        onSuccess: (newInviteSlug) => {
            console.log(id);
            queryClient.setQueryData(["project", Number(id)], oldProject => {
                return {...oldProject, inviteSlug: newInviteSlug};
            });
        }
    });
}

export const useArchivedProjects = () => {
    return useQuery('archived-projects', fetchArchivedProjects);
}