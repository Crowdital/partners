import axios from "axios";

const API_URL = process.env.VUE_APP_API_BASE_URL;

const http = axios.create({
  baseURL: API_URL + "/api/",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const STORAGE_URL = process.env.VUE_APP_STORAGE_URL;
export default http;