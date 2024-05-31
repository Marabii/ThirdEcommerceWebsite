import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER // or your server's base URL
})

// Request interceptor to add the JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (token expired or invalid)
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('tokenExpiration')

      console.log(error)

      // Instead of redirecting immediately, use history to push to login with redirect state
      const currentPath = window.location.pathname
      window.location.href = `${import.meta.env.VITE_REACT_APP_CLIENT}/login?redirect=${currentPath}`

      // If you're using React Router v6, you might need to update the way you handle history
      // with useNavigate instead of createBrowserHistory or useHistory
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
