import api from './http';

export const getCommentsByEntity = (entityType, entityId) =>
  api.get(`/api/v1/comments/${entityType}/${entityId}`);

export const createComment = (entityType, entityId, payload) =>
  api.post(`/api/v1/comments/${entityType}/${entityId}`, payload);

export const updateComment = (id, payload) => api.put(`/api/v1/comments/${id}`, payload);

export const deleteComment = (id) => api.delete(`/api/v1/comments/${id}`);
