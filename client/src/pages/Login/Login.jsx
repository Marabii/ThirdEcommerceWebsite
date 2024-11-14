import React, { useState, useContext, useEffect } from 'react'
import Header from '../../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { globalContext } from '../../App'
import { jwtDecode } from 'jwt-decode'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const clientURL = import.meta.env.VITE_REACT_APP_CLIENT
  const [formData, setFormData] = useState({ password: '', email: '' })
  const { setIsLoggedIn } = useContext(globalContext)
  const queryParams = new URLSearchParams(location.search)
  const redirect = queryParams.get('redirect') || '/'

  useEffect(() => {
    if (redirect !== '/') {
      toast.warning('Your session is expired, please relogin')
    }
  }, [redirect])

  const storeToken = (token) => {
    const decodedToken = jwtDecode(token)
    const expirationTime = decodedToken.exp * 1000
    localStorage.setItem('jwtToken', token)
    localStorage.setItem('tokenExpiration', expirationTime)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${serverURL}/api/login`, formData)
      if (response.data.success) {
        const { token } = response.data
        storeToken(token)
        setIsLoggedIn(true)
        toast.success('Logged In Successfully')
        window.location.href = `${clientURL}${redirect}`
      } else {
        throw new Error("Can't log in")
      }
    } catch (error) {
      setIsLoggedIn(false)
      toast.error("Can't Log In")
      console.error(error)
    }
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    navigate('/register')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-20 pb-36">
        <Header />
        <div className="relative flex flex-col items-center justify-center space-x-0 px-5 py-20 sm:px-10 md:flex-row md:space-x-10 lg:px-20 ">
          <div className="absolute -top-[200px] bottom-0 left-0 -z-10 max-h-[1000px] w-full bg-[#eff1f5]"></div>
          <div className="w-fit font-playfair md:w-1/3">
            <h1 className="relative -top-14 whitespace-nowrap text-6xl font-bold">
              Login
            </h1>
            <p className="max-w-[40ch] leading-9">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Molestiae, reprehenderit!
            </p>
          </div>
          <img
            className="w-full max-w-[800px] sm:w-2/3"
            src="/sofa.png"
            alt="sofa-img"
          />
        </div>
        <div className="test-center flex w-full flex-col items-center bg-white pt-20">
          <h1 className="font-playfair text-6xl font-bold">Login</h1>
          <p className="py-5 text-lg text-gray-400">
            Please fill your email and password to login
          </p>
          <form
            className="w-full max-w-[550px] space-y-5 px-5"
            onSubmit={handleLoginSubmit}
          >
            <div>
              <label
                className="mb-2 block font-playfair text-lg font-bold"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full border-2 border-black p-5"
                type="text"
                name="email"
                autoComplete="on"
                id="email"
                placeholder="Type Your Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="mb-2 block font-playfair text-lg font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full border-2 border-black p-5"
                type="password" // Changed to password type for security
                name="password"
                autoComplete="on"
                id="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
              type="submit"
            >
              Login
            </button>
            <a href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3001/google/callback&response_type=code&client_id=1028629889843-4vf1i5nfjis4o4ht1posamrrrv5l106p.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline">
              <button
                type="button"
                className="w-full border-2 mt-5 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                Sign In With Google
              </button>
            </a>
            <p className="mt-5 w-full text-start text-gray-800">
              Don't Have An Account ?{' '}
              <button
                className="ml-5 border-b-2 border-black text-lg font-bold text-black"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
