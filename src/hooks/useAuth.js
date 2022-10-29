import {check, login, signup, updateSettings} from "apis/auth.api";
import {useMutation, useQuery, useQueryClient} from "react-query";

export const useCheckUserQuery = () => {
    const queryClient = useQueryClient();

    return useQuery("user", check, {
        cacheTime: 36000000,
        initialData: null,
        refetchInterval: 30000000,
        refetchIntervalInBackground: true,
        retry: false,
        retryOnMount: false,
        onError: () => queryClient.setQueryData("user", undefined)
    });
};

export const useUpdateSettingsQuery = () => {
    const queryClient = useQueryClient();

    return useMutation(updateSettings, {
        onSuccess: (updatedUserSettings) => {
            queryClient.setQueryData("user", (oldUser => {
                return {...oldUser, ...updatedUserSettings};
            }));
        }
    });
};

export const useLoginQuery = (options) => {
    return useMutation(login, options);
};

export const useSignUpQuery = () => {
    return useMutation(signup);
};