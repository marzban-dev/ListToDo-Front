import axios from "axios";

const instance = axios.create({
  baseURL: "https://listtodo2030.pythonanywhere.com/"
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
