import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

const useAdminAccess = () => {
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const verifyAdmin = async () => {
      const expirationTime = localStorage.getItem('tokenExpiration')
      const oneHour = 60 * 60 * 1000

      // Check if session is expired before making a request
      if (
        !expirationTime ||
        Date.now() - parseInt(expirationTime, 10) > oneHour
      ) {
        toast.warning('Session Expired, Please Relogin')
        navigate('/login')
        return
      }

      try {
        const response = await axios.get(`${serverURL}/api/verifyAdmin`, {
          headers: { Authorization: localStorage.getItem('jwtToken') }
        })

        if (!response.data || !response.data.success) {
          navigate('/error-page')
        }
      } catch (error) {
        console.error('Failed to verify admin:', error)
        navigate('/error-page')
      }
    }

    verifyAdmin()
  }, [])

  return { ToastContainer }
}

export default useAdminAccess
