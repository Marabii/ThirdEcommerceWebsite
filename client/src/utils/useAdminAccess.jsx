import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axiosInstance from './verifyJWT'

const useAdminAccess = () => {
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      const expirationTime = localStorage.getItem('tokenExpiration')
      const oneHour = 60 * 60 * 1000
      if (
        !expirationTime ||
        Date.now() - parseInt(expirationTime, 10) > oneDay
      ) {
        toast.warning('Session Expired, Please Relogin')
        navigate('/login')
        return
      }

      try {
        const response = await axiosInstance.get(`${serverURL}/api/verifyAdmin`)
        if (response.data.success) {
          setIsAllowed(true)
        } else {
          navigate('/')
        }
      } catch (e) {
        console.error(e)
        navigate('/login')
      }
    }

    checkTokenAndFetchData()
  }, [navigate, serverURL])

  return {
    isAllowed,
    ToastContainer
  }
}

export default useAdminAccess
