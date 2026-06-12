import api from './http';

export const getProjectMembers = (projectId) =>
  api.get(`/api/v1/project-members/project/${projectId}`);

export const createProjectMember = (payload) =>
  api.post('/api/v1/project-members', payload);
