import api from "./http";

export const getProjects = () => api.get('/api/v1/projects');
export const getProjectsCatalog = () => api.get('/api/v1/projects/catalog');
export const createProject = (payload) => api.post('/api/v1/projects', payload);
export const getProjectById = (id) => api.get(`/api/v1/projects/${id}`);
export const updateProject = (id, payload) => api.put(`/api/v1/projects/${id}`, payload);
