import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_SERVER, // or your server's base URL
});

// Request interceptor to add the JWT token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized errors (token expired or invalid)
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('tokenExpiration');
            // window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
