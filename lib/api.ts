import axios from "axios";

export const api = axios.create({
    baseURL: "https://dimsumwrap3d.berkahost.biz.id/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});