import axios from "axios.instance";

export const login = async ({username, password}) => {

    const response = await axios.post("/auth/jwt/create/", {username, password});

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    localStorage.setItem("AUTH_ACCESS_TOKEN", accessToken);
    localStorage.setItem("AUTH_REFRESH_TOKEN", refreshToken);
}

export const refreshToken = async () => {
    // Use refresh token if it exists, to update both refresh and access token.
    const oldRefreshToken = localStorage.getItem("AUTH_REFRESH_TOKEN");

    // Update access and refresh token by old refresh token, if it exists.
    if (oldRefreshToken) {
        const newToken = await axios.post("/auth/jwt/refresh/", {
            refresh: oldRefreshToken,
        });

        const accessToken = newToken.data.access;
        const refreshToken = newToken.data.refresh;

        // Set fetched new tokens to local storage.
        localStorage.removeItem("AUTH_ACCESS_TOKEN");
        localStorage.removeItem("AUTH_REFRESH_TOKEN");
        localStorage.setItem("AUTH_ACCESS_TOKEN", accessToken);
        localStorage.setItem("AUTH_REFRESH_TOKEN", refreshToken);

        // Again, checking the user to login.
        const user = await axios.get("/myinfo/");
        return user.data;

    } else {
        throw new Error("refresh_token_not_found");
    }
}

export const check = async () => {
    const accessToken = localStorage.getItem("AUTH_ACCESS_TOKEN");

    try {
        if (accessToken) {
            // Get user from server if access token is exists.
            const user = await axios.get("/myinfo/");
            return user.data;
        } else {
            return await refreshToken();
        }
    } catch (error) {
        // If an error from access token,
        // then refreshToken() function is going to run to refreshing the tokens.

        if (error.response && error.response.data.messages[0].token_type === "access") {
            refreshToken().then(user => {
                return user;
            }).catch(error => {
                console.log(error);
                localStorage.removeItem("AUTH_ACCESS_TOKEN");
                localStorage.removeItem("AUTH_REFRESH_TOKEN");
            });
        } else {
            localStorage.removeItem("AUTH_ACCESS_TOKEN");
            localStorage.removeItem("AUTH_REFRESH_TOKEN");
            throw error;
        }
    }
}

export const updateSettings = async ({properties, uploadProgressHandler}) => {
    const updatedSetting = await axios.put("/myinfo/", properties, {
        onUploadProgress: uploadProgressHandler
    });
    return updatedSetting.data;
}