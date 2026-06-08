import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});
