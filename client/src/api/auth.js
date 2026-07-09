import api from "./http";

export const registerRequest = user => api.post('/api/v1/auth/signup', user);

export const loginRequest = credentials => api.post('/api/v1/auth/login', credentials);

export const confirmEmailVerificationRequest = token => api.post('/api/v1/auth/email-verification/confirm', { token });

export const resendEmailVerificationRequest = email => api.post('/api/v1/auth/email-verification/resend', { email });

export const acceptEmployeeInvitationRequest = token => api.post(`/api/v1/auth/employee-invitations/${token}/accept`);

export const logoutRequest = () => api.post('/api/v1/auth/logout');

export const verifySessionRequest = () => api.get('/api/v1/auth/me');

export const switchActiveCompanyRequest = (companyId) => api.patch('/api/v1/companies/active', { companyId });

export default api;
