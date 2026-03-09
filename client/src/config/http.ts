import axios from 'axios';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T | null;
  errors?: unknown;
};

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Set a base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to headers
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
http.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<any>;
    if (data.success) {
      return data.data;
    }
    return Promise.reject(new Error(data.message));
  },
  async (error) => {
    const originalRequest = error.config;
    // Example: Handle 401 Unauthorized errors
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Logic to refresh token goes here (often involves another API call)
      try {
        // const newAccessToken = await refreshToken(); 
        // axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        // return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Handle refresh failure (e.g., redirect to login)
        // Note: Using a router hook here requires specific handling outside components
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
