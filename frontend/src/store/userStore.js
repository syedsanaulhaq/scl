import { create } from 'zustand';
import userService from '../services/userService';

const useUserStore = create((set, get) => ({
    users: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    },
    isLoading: false,
    error: null,

    // Fetch users with filters
    fetchUsers: async (page = 1, limit = 10, search = '', role = '') => {
        set({ isLoading: true, error: null });
        try {
            const { data, pagination } = await userService.getUsers(page, limit, search, role);
            set({ users: data, pagination, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch users',
                isLoading: false
            });
        }
    },

    // Add a user
    addUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await userService.createUser(userData);
            // Refresh list after adding
            const { pagination } = get();
            await get().fetchUsers(pagination.page, pagination.limit);
            return { success: true, message: response.message };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to add user',
                isLoading: false
            });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Update a user
    updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await userService.updateUser(id, userData);
            // Refresh list or update local state
            const { users } = get();
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, ...response.data } : user
            );
            set({ users: updatedUsers, isLoading: false });
            return { success: true, message: response.message };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update user',
                isLoading: false
            });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Delete a user
    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await userService.deleteUser(id);
            // Optimistic update
            const { users, pagination } = get();
            set({
                users: users.filter(user => user.id !== id),
                pagination: { ...pagination, total: pagination.total - 1 },
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete user',
                isLoading: false
            });
            return { success: false, message: error.response?.data?.message };
        }
    }
}));

export default useUserStore;
