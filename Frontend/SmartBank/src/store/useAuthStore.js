import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  error: null,

  // Action to check if user is already logged in (runs on app mount)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true, error: null });
      const res = await api.get('/auth/check');
      if (res.data.loggedIn && res.data.data) {
        // Fetch full user data after token is verified
        const userRes = await api.get('/auth/getUser');
        if(userRes.data.status === 'success') {
          set({ 
            user: userRes.data.userdata, 
            isAuthenticated: true, 
            isCheckingAuth: false 
          });
          return true;
        }
      }
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return false;
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return false;
    }
  },

  // Action to login
  login: async (email, password) => {
    try {
      set({ error: null });
      const res = await api.post('/auth/login', { email, password });
      if (res.data.status === 'success') {
        set({ user: res.data.user, isAuthenticated: true });
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed' });
      return false;
    }
  },

  // Action to register
  register: async (userData) => {
    try {
      set({ error: null });
      const res = await api.post('/auth/register', userData);
      if (res.data.status === 'success') {
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      return false;
    }
  },

  // Action to logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error", error);
    }
  },
  
  // Set explicit user data
  setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),
}));

export default useAuthStore;
