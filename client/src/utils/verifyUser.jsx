import React, { useEffect } from 'react'
import axiosInstance from './verifyJWT'

const UseAuthCheck = (props) => {
  const { interval, setIsLoggedIn, setCartItems } = props
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.get(`${serverURL}/api/verifyUser`)
        setIsLoggedIn(response.data.isLoggedIn)
        setCartItems(response.data.cartItems || [])
      } catch (error) {
        console.error('Failed to verify user:', error)
        setIsLoggedIn(false)
        alert('Error Verifying The User')
      }
    }

    verifyUser() // Verify immediately on mount
    const intervalId = setInterval(verifyUser, interval)

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  return null // This hook does not render anything
}

export default UseAuthCheck
