import axios from "axios";
import { csrfService } from "@/services/csrfService";

const API_BASE_URL = process.env.NODE_ENV === 'production' ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing methods
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        const csrfToken = await csrfService.getCsrfToken();
        config.headers['X-CSRF-Token'] = csrfToken;
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
        // Continue without CSRF token - let the server handle the error
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Update refresh token if a new one was provided (token rotation)
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle CSRF token errors
    if (error.response?.status === 403 && 
        error.response?.data?.message?.includes('CSRF')) {
      try {
        // Refresh CSRF token and retry the request
        await csrfService.refreshToken();
        const csrfToken = await csrfService.getCsrfToken();
        originalRequest.headers['X-CSRF-Token'] = csrfToken;
        return api(originalRequest);
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;