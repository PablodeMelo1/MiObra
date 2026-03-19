import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getTasksByProjectId = (projectId) =>
  api.get(`/api/v1/tasks/project/${projectId}`);

export const moveTaskToList = (projectId, taskId, list) =>
  api.put(`/api/v1/tasks/project/${projectId}/${taskId}`, { list });

export const createTask = (projectId, payload) =>
  api.post(`/api/v1/tasks/project/${projectId}`, payload);

export const updateTask = (projectId, taskId, payload) =>
  api.put(`/api/v1/tasks/project/${projectId}/${taskId}`, payload);

export const deleteTask = (projectId, taskId) =>
  api.delete(`/api/v1/tasks/project/${projectId}/${taskId}`);
