import axios from 'axios';
import { API_URL } from './http';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getProjectMembers = (projectId) =>
  api.get(`/api/v1/project-members/project/${projectId}`);

export const createProjectMember = (payload) =>
  api.post('/api/v1/project-members', payload);
