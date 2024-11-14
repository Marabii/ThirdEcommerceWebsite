import React, { useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${serverURL}/api/register`, formData)
      if (response.data.success) {
        toast.success('Registered Successfully')
        navigate('/login')
      } else {
        throw new Error(response.data.msg)
      }
    } catch (e) {
      toast.error('Unable To Register')
      console.error(e)
    }
  }

  const handleSignInClick = () => {
    navigate('/login')
    return
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="pb-36">
      <Header />
      <div className="relative flex flex-col items-center justify-center space-x-0 px-5 py-20 sm:px-10 md:flex-row md:space-x-10 lg:px-20 ">
        <div className="absolute -top-[200px] bottom-0 left-0 -z-10 max-h-[1000px] w-full bg-[#eff1f5]"></div>
        <div className="w-fit font-playfair md:w-1/3">
          <h1 className="relative -top-14 whitespace-nowrap text-6xl font-bold">
            Register
          </h1>
          <p className="max-w-[40ch] leading-9">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae,
            reprehenderit!
          </p>
        </div>
        <img
          className="w-full max-w-[800px] sm:w-2/3"
          src="/sofa.png"
          alt="sofa-img"
        />
      </div>
      <div className="flex w-full flex-col items-center bg-white pt-20 text-center">
        <h1 className="font-playfair text-6xl font-bold">Create an account</h1>
        <p className="py-5 text-lg text-gray-400">
          Create an account and start using...
        </p>
        <form
          className="w-full max-w-[550px] space-y-5 px-5"
          onSubmit={handleRegisterSubmit}
        >
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full border-2 border-black p-5"
              type="text"
              name="name"
              autoComplete="on"
              id="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              type="text"
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
            Sign Up
          </button>
          <p className="mt-5 w-full text-start text-gray-800">
            Already Have An Account ?{' '}
            <button
              className="ml-5 border-b-2 border-black text-lg font-bold text-black"
              onClick={handleSignInClick}
            >
              Sign-In
            </button>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
