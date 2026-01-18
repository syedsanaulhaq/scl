import api from './api';

const userService = {
    // Get all users with pagination
    getUsers: async (page = 1, limit = 10, search = '', role = '') => {
        const response = await api.get('/v1/users', {
            params: { page, limit, search, role }
        });
        return response;
    },

    // Create a new user
    createUser: async (userData) => {
        const response = await api.post('/v1/users', userData);
        return response;
    },

    // Update a user
    updateUser: async (id, userData) => {
        const response = await api.patch(`/v1/users/${id}`, userData);
        return response;
    },

    // Delete a user
    deleteUser: async (id) => {
        const response = await api.delete(`/v1/users/${id}`);
        return response;
    }
};

export default userService;
