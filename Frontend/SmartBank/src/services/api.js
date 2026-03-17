import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // Important for HTTP-only cookies
});

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401 (Unauthorized) and we haven't already handled it...
    // The Zustand store or React components can react to this, but we can't directly 
    // call hooks here. We handle clearing the auth state where this API is consumed, 
    // or by importing the store directly.
    return Promise.reject(error);
  }
);

export default api;
