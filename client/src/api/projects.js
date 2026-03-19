import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getProjects = () => api.get('/api/v1/projects');
export const getProjectsCatalog = () => api.get('/api/v1/projects/catalog');
export const createProject = (payload) => api.post('/api/v1/projects', payload);
export const getProjectById = (id) => api.get(`/api/v1/projects/${id}`);
export const updateProject = (id, payload) => api.put(`/api/v1/projects/${id}`, payload);