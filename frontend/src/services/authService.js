import api from './api';

export const register = async (email, password, name, role = 'student') => {
  const response = await api.post('/v1/auth/register', { 
    email, 
    password, 
    name,
    role 
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/v1/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/v1/auth/logout');
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post('/v1/auth/refresh', { refreshToken });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/v1/auth/profile');
  return response.data;
};

export const updateProfile = async (name) => {
  const response = await api.patch('/v1/auth/profile', { name });
  return response.data;
};
