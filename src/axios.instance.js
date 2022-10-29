import axios from "axios";

export const instance = axios.create({
    baseURL: "https://listtodo1234.pythonanywhere.com/",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("AUTH_ACCESS_TOKEN");

    const isRequestToSignupUrl =
        config.url === `/auth/users/` && config.method === "post";

    if (!isRequestToSignupUrl) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default instance;
