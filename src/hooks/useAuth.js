import {check, login, updateSettings} from "apis/auth.api";
import {useMutation, useQuery, useQueryClient} from "react-query";

export const useCheckUserQuery = () => {
    const queryClient = useQueryClient();

    return useQuery("user", check, {
        cacheTime: 36000000,
        initialData: null,
        refetchInterval: 30000,
        refetchIntervalInBackground: true,
        retry: false,
        retryOnMount: false,
        onError: () => queryClient.setQueryData("user", undefined)
    });
};

export const useUpdateSettingsQuery = (options) => {
    const queryClient = useQueryClient();

    return useMutation(updateSettings, {
        onSuccess: (updatedSettings) => {
            queryClient.setQueryData("settings", (oldSettings => {
                return {...oldSettings, ...updatedSettings};
            }));
        },
        ...options
    });
};

export const useLoginQuery = (options) => {
    return useMutation(login, options);
};


// export const signupUser = (username, email, password) => {
//     return async (dispatch) => {
//         dispatch(startAuthUser());
//
//         try {
//             await axios.post("/auth/users/", {
//                 username,
//                 email,
//                 password,
//             });
//
//             dispatch(finishAuthUser());
//         } catch (error) {
//             console.log(error.response);
//             dispatch(authUserFailed());
//             throw error;
//         }
//     };
// };

// export const updateUserSettings = (properties, uploadProgressHandler) => {
//     return async (dispatch) => {
//         try {
//             console.log(properties);
//             const updatedSetting = await axios.put("/setting/", properties, {
//                 onUploadProgress: uploadProgressHandler
//             });
//             console.log(updatedSetting);
//             dispatch(setSettings(updatedSetting.data));
//         } catch (error) {
//             throw error;
//         }
//     }
// }
