import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const useAdminAccess = () => {
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      const expirationTime = localStorage.getItem('tokenExpiration')
      const oneHour = 60 * 60 * 1000

      try {
        const response = await axios.get(`${serverURL}/api/verifyAdmin`, {
          headers: {
            Authorization: localStorage.getItem('jwtToken')
          }
        })
        if (response.data) {
          if (response.data.success) {
            if (
              !expirationTime ||
              Date.now() - parseInt(expirationTime, 10) > oneHour
            ) {
              toast.warning('Session Expired, Please Relogin')
              navigate('/login')
              return
            }
          } else {
            navigate('/error-page')
          }
        } else {
          navigate('/error-page')
        }
      } catch (e) {
        navigate('/error-page')
      }
    }

    checkTokenAndFetchData()
  }, [])

  return {
    ToastContainer
  }
}

export default useAdminAccess
