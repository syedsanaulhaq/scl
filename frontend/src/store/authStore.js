import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  tokens: { accessToken: null, refreshToken: null },

  // Set user with tokens
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      isAuthenticated: true,
      tokens: { accessToken, refreshToken },
      isLoading: false,
    });
  },

  // Set user
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  // Clear user (logout)
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      tokens: { accessToken: null, refreshToken: null },
      isLoading: false,
    });
  },

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Restore auth from localStorage
  restoreAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          isAuthenticated: true,
          tokens: { accessToken, refreshToken },
          isLoading: false,
        });
        return true;
      } catch (error) {
        set({ isLoading: false });
        return false;
      }
    } else {
      set({ isLoading: false });
      return false;
    }
  },
}));

export default useAuthStore;
