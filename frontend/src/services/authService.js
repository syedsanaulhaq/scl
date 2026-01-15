import api from './api';

export const authService = {
  login: async (email, password) => {
    return api.post('/v1/auth/login', { email, password });
  },

  register: async (data) => {
    return api.post('/v1/auth/register', data);
  },

  logout: async () => {
    return api.post('/v1/auth/logout');
  },

  refreshToken: async (refreshToken) => {
    return api.post('/v1/auth/refresh', { refreshToken });
  },

  getCurrentUser: async () => {
    return api.get('/v1/auth/me');
  },
};

export default authService;
