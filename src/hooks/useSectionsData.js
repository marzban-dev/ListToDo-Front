import {useMutation, useQuery, useQueryClient} from "react-query";
import {createSection, deleteSection, fetchSections, updateSection} from "apis/sections.api";

export const useSectionsQuery = (id, options) => {
    return useQuery(
        ["project-sections", id],
        () => fetchSections({project: id}),
        {initialData: null, ...options}
    );
};

export const useCreateSectionQuery = (id) => {
    const queryClient = useQueryClient();

    return useMutation(createSection, {
        onSuccess: (createdSection) => {
            queryClient.setQueryData(["project-sections", id], oldSections => {
                return [...oldSections, createdSection];
            })
        }
    });
};

export const useDeleteSectionQuery = (parentId) => {
    const queryClient = useQueryClient();

    return useMutation(deleteSection, {
        onMutate: async (id) => {
            await queryClient.cancelQueries(["project-sections", parentId]);
            const previousSectionsData = queryClient.getQueryData(["project-sections", parentId]);
            queryClient.setQueryData(
                ["project-sections", parentId],
                oldSections => oldSections.filter(sec => sec.id !== id)
            );
            return {previousSectionsData};
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(["project-sections", parentId], context.previousSectionsData)
        },
        onSettled: () => {
            queryClient.invalidateQueries(["project-sections", parentId]);
        }
    });
};


export const useUpdateSectionQuery = (id, parentId) => {
    const queryClient = useQueryClient();

    return useMutation(updateSection, {
        onMutate: async ({data: sectionUpdatedData}) => {
            await queryClient.cancelQueries(["project-sections", parentId]);
            const previousSectionsData = queryClient.getQueryData(["project-sections", parentId]);
            queryClient.setQueryData(["project-sections", parentId], oldSections => {
                return oldSections.map(sec => {
                    if (sec.id === id) return {...sec, ...sectionUpdatedData};
                    else return sec;
                });
            })
            return {previousSectionsData};
        },
        onError: (_error, _newSection, context) => {
            queryClient.setQueryData(["project-sections", parentId], context.previousSectionsData)
        },
        onSettled: () => {
            queryClient.invalidateQueries(["project-sections", parentId]);
        }
    });
};