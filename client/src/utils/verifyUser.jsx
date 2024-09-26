import { useEffect } from 'react'
import axiosInstance from './verifyJWT'
import countryToCurrency from 'country-to-currency'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const UseAuthCheck = (props) => {
  const { interval, setIsLoggedIn, setCartItems, setUserData, setExploreAll } =
    props
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const jwtTokenUnDecoded = localStorage.getItem('jwtToken')
  const jwtToken = jwtTokenUnDecoded && jwtDecode(jwtTokenUnDecoded)
  const userId = jwtToken?.sub

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance(
          `${serverURL}/api/getUserData/${userId}`
        )
        const data = response.data
        setUserData(data[0])
      } catch (e) {
        console.error(e)
      }
    }
    if (userId) getUserData()
  }, [])

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.get(`${serverURL}/api/verifyUser`)
        setIsLoggedIn(response.data.isLoggedIn)
        setCartItems(response.data.cartItems || [])
      } catch (error) {
        console.error('Failed to verify user:', error)
        setIsLoggedIn(false)
      }
    }

    verifyUser()
    const intervalId = setInterval(verifyUser, interval)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const getExploreAll = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/exploreAll`)
        const data = response.data
        setExploreAll(data)
      } catch (e) {
        console.log(e)
      }
    }
    getExploreAll()
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const getCountryIsoCode = async () => {
          try {
            const response = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = response.data
            localStorage.setItem('countryCode', data.countryCode)
            return data.countryCode
          } catch (e) {
            console.error(e)
          }
        }

        const getCurrencyCode = async () => {
          try {
            const countryCode = await getCountryIsoCode()
            const currencyCode = countryToCurrency[countryCode]
            localStorage.setItem('currencyCode', currencyCode)
            return currencyCode
          } catch (e) {
            console.error(e)
          }
        }

        ;(async () => {
          try {
            const currencyCode = await getCurrencyCode()
            console.log('currencyCode: ', currencyCode)
          } catch (e) {
            console.error(e)
          }
        })()
      })
    }
  }, [])

  return null
}

export default UseAuthCheck
