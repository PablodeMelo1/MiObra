import axios from "axios";
import { API_URL } from "./http";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getUserProfile = (id) => api.get(`/api/v1/users/${id}`);
export const getUsers = () => api.get('/api/v1/users');
export const updateUserProfile = (id, payload) => api.put(`/api/v1/users/${id}`, payload);
