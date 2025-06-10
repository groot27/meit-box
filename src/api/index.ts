// src/api/index.ts
import axios, { AxiosRequestConfig } from "axios";
import { useGlobalStore } from "@/stores";
import { getEnvVar } from "@/utils/env";
const instance = axios.create({
  baseURL: getEnvVar("VITE_API_URL"),
  timeout: 20000,
  headers: {
    accept: "application/json, text/plain, */*",
  },
});

// Add auth token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const globalStore = useGlobalStore();
    console.error("API Error:", err);
    globalStore.setLoadingApi(false);
    return Promise.reject(err);
  }
);

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config),
};
