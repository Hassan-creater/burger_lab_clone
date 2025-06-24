import axios, { AxiosInstance } from "axios";
import { getClientCookie } from "./getCookie";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// **Interceptor to dynamically set Authorization header**
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") { // Ensure it's running in the browser
    const accessToken = getClientCookie("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});




const apiClientCustomer: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { apiClient, apiClientCustomer };