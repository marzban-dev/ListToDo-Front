import axios from "AxiosInstance";

export const START_AUTH_USER = "START_AUTH_USER";
export const FINISH_AUTH_USER = "FINISH_AUTH_USER";
export const SET_AUTHENTICATED_USER = "SET_AUTHENTICATED_USER";
export const AUTH_USER_FAILED = "AUTH_USER_FAILED";
export const START_PRE_AUTH = "START_PRE_AUTH";
export const FINISH_PRE_AUTH = "FINISH_PRE_AUTH";

export const startPreAuth = () => ({ type: START_PRE_AUTH });
export const finishPreAuth = () => ({ type: FINISH_PRE_AUTH });
export const startAuthUser = () => ({ type: START_AUTH_USER });
export const finishAuthUser = () => ({ type: FINISH_AUTH_USER });
export const authUserFailed = () => ({ type: AUTH_USER_FAILED });
export const setAuthenticatedUser = (user) => ({
  type: SET_AUTHENTICATED_USER,
  user,
});

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
        throw new Error("refresh token does not exist");
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

        // Set fetched user from server.
        dispatch(setAuthenticatedUser(authenticatedUser.data));
        dispatch(finishAuthUser());
      } else {
        // Use refresh token if it exist, to update both refresh and access token.
        await dispatch(refreshToken());
      }
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
        dispatch(refreshToken()).catch((error) => {
          localStorage.removeItem("AUTH_ACCESS_TOKEN");
          localStorage.removeItem("AUTH_REFRESH_TOKEN");
        });
      } else {
        localStorage.removeItem("AUTH_ACCESS_TOKEN");
        localStorage.removeItem("AUTH_REFRESH_TOKEN");
      }

      // Set auth user state to false.
      dispatch(authUserFailed());
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

      console.log(loginResult.data);

      const accessToken = loginResult.data.access;
      const refreshToken = loginResult.data.refresh;

      localStorage.clear();
      localStorage.setItem("AUTH_ACCESS_TOKEN", accessToken);
      localStorage.setItem("AUTH_REFRESH_TOKEN", refreshToken);

      const authenticatedUser = await axios.get("/auth/users/me/");

      dispatch(setAuthenticatedUser(authenticatedUser.data));
      dispatch(finishAuthUser());

      return true;
    } catch (error) {
      dispatch(authUserFailed());
      return false;
    }
  };
};

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
      return true;
    } catch (error) {
      console.log(error.response);
      dispatch(authUserFailed());
      return false;
    }
  };
};
