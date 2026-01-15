import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Set user
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  // Clear user (logout)
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Login
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // API call will be implemented
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      // API call will be implemented
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // API call will be implemented
      set({ isLoading: false });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
