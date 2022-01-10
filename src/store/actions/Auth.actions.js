import axios from "AxiosInstance";
import {setData} from "./Main.actions";

export const START_AUTH_USER = "START_AUTH_USER";
export const FINISH_AUTH_USER = "FINISH_AUTH_USER";
export const SET_AUTHENTICATED_USER = "SET_AUTHENTICATED_USER";
export const AUTH_USER_FAILED = "AUTH_USER_FAILED";
export const START_PRE_AUTH = "START_PRE_AUTH";
export const FINISH_PRE_AUTH = "FINISH_PRE_AUTH";
export const SET_SETTINGS = "SET_SETTINGS";

export const startPreAuth = () => ({type: START_PRE_AUTH});
export const finishPreAuth = () => ({type: FINISH_PRE_AUTH});
export const startAuthUser = () => ({type: START_AUTH_USER});
export const finishAuthUser = () => ({type: FINISH_AUTH_USER});
export const authUserFailed = () => ({type: AUTH_USER_FAILED});
export const setAuthenticatedUser = (user) => ({type: SET_AUTHENTICATED_USER, user});
export const setSettings = (settings) => ({type: SET_SETTINGS, settings});

export const refreshToken = () => {
    return async (dispatch) => {
        try {
            const oldRefreshToken = localStorage.getItem("AUTH_REFRESH_TOKEN");

            // Update access and refresh token by old refresh token, if it exist.
            if (oldRefreshToken) {
                const newToken = await axios.post("/auth/jwt/refresh/", {
                    refresh: oldRefreshToken,
                });

                const accessToken = newToken.data.access;
                const refreshToken = newToken.data.refresh;

                // Set new fetched tokens to local storage.
                localStorage.clear();
                localStorage.setItem("AUTH_ACCESS_TOKEN", accessToken);
                localStorage.setItem("AUTH_REFRESH_TOKEN", refreshToken);
                // Again, checking the user to login.
                dispatch(checkUser());
            } else {
                throw new Error("refresh_token_not_found");
            }
        } catch (error) {
            throw error;
        }
    };
};

export const checkUser = () => {
    return async (dispatch) => {
        try {
            dispatch(startAuthUser());

            const accessToken = localStorage.getItem("AUTH_ACCESS_TOKEN");

            // Get user from server if access token is exist.
            if (accessToken) {

                const authenticatedUser = await axios.get("/auth/users/me/");
                const userSettings = await axios.get("/setting/");

                // Set fetched user from server.
                dispatch(setAuthenticatedUser({
                    ...authenticatedUser.data,
                    setting: userSettings.data
                }));
            } else {
                // Use refresh token if it exist, to update both refresh and access token.
                await dispatch(refreshToken());
            }

            dispatch(finishAuthUser())
        } catch (error) {
            // If an error from access token,
            // then refreshToken() function is going to run to refreshing the tokens.

            // if (error.response && error.toJSON().message === "Network Error") {
            //   if(localStorage.getItem("AUTH_ACCESS_TOKEN")){

            //   }
            // }

            if (
                error.response &&
                error.response.data.messages[0].token_type === "access"
            ) {
                dispatch(refreshToken()).catch(() => {
                    localStorage.removeItem("AUTH_ACCESS_TOKEN");
                    localStorage.removeItem("AUTH_REFRESH_TOKEN");
                });
            } else {
                localStorage.removeItem("AUTH_ACCESS_TOKEN");
                localStorage.removeItem("AUTH_REFRESH_TOKEN");
                // Set auth user state to false.
                dispatch(authUserFailed());
                throw error;
            }
        }
    };
};

export const loginUser = (username, password) => {
    return async (dispatch) => {
        dispatch(startAuthUser());
        try {
            const loginResult = await axios.post("/auth/jwt/create/", {
                username,
                password,
            });

            const accessToken = loginResult.data.access;
            const refreshToken = loginResult.data.refresh;

            localStorage.removeItem("AUTH_ACCESS_TOKEN");
            localStorage.removeItem("AUTH_REFRESH_TOKEN");
            localStorage.setItem("AUTH_ACCESS_TOKEN", accessToken);
            localStorage.setItem("AUTH_REFRESH_TOKEN", refreshToken);

            const authenticatedUser = await axios.get("/auth/users/me/");
            const userSettings = await axios.get("/setting/");

            dispatch(setAuthenticatedUser({
                ...authenticatedUser.data,
                setting: userSettings.data
            }));
            dispatch(finishAuthUser());
        } catch (error) {
            dispatch(authUserFailed());
            throw error;
        }
    };
};

export const logout = () => {
    return async (dispatch) => {
        try {
            localStorage.setItem("AUTH_ACCESS_TOKEN", null);
            localStorage.setItem("AUTH_REFRESH_TOKEN", null);
            dispatch(setAuthenticatedUser(null));
            dispatch(setData({
                labels: [],
                projects: []
            }))
        } catch (error) {
            throw error;
        }
    }
}

export const signupUser = (username, email, password) => {
    return async (dispatch) => {
        dispatch(startAuthUser());

        try {
            await axios.post("/auth/users/", {
                username,
                email,
                password,
            });

            dispatch(finishAuthUser());
        } catch (error) {
            console.log(error.response);
            dispatch(authUserFailed());
            throw error;
        }
    };
};

export const updateUserSettings = (properties, uploadProgressHandler) => {
    return async (dispatch) => {
        try {
            console.log(properties);
            const updatedSetting = await axios.put("/setting/", properties, {
                onUploadProgress: uploadProgressHandler
            });
            console.log(updatedSetting);
            dispatch(setSettings(updatedSetting.data));
        } catch (error) {
            throw error;
        }
    }
}
