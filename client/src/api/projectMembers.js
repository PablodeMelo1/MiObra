import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getProjectMembers = (projectId) =>
  api.get(`/api/v1/project-members/project/${projectId}`);

export const createProjectMember = (payload) =>
  api.post('/api/v1/project-members', payload);
