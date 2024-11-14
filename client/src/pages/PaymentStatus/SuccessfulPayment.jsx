import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/verifyJWT'

const SuccessfulPayment = () => {
  const serverUrl = import.meta.env.VITE_REACT_APP_SERVER
  const navigate = useNavigate()

  useEffect(() => {
    const getShowPage = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverUrl}/api/getRecentOrder`
        )
        const order = response.data
        if (order.isSuccessfulPageSeen) {
          navigate('/')
        }
        await axiosInstance.put(
          `${serverUrl}/api/setIsSuccessfulPageSeen/${order._id}`
        )
      } catch (e) {
        console.error(e)
        navigate('/')
      }
    }
    getShowPage()
  }, [])

  return (
    <div className="grid h-screen w-screen place-items-center overflow-x-hidden py-52 font-jost">
      <div className="flex w-[80%] flex-col items-center p-5 shadow-2xl">
        <h3 className="text-md font-bold">Farnic</h3>
        <h1 className="text-lg">Payment Successful!</h1>
        <img
          className="max-w-[350px]"
          src="/payment_success.gif"
          alt="payment successful"
        />
        <p>You will soon receive an email with the receipt</p>
        <h2 className="mt-5 text-center font-semibold text-red-600">
          <span>
            Disclaimer: If you haven't received any emails regarding your order,
            contact support immediately
          </span>{' '}
          <a href={`mailto:${import.meta.env.VITE_REACT_APP_SUPPORT}`}>
            <button className="cursor-pointer border-b border-red-600">
              Contact Support
            </button>
          </a>
        </h2>
        <button
          onClick={() => navigate('/')}
          className="mt-5 bg-green-400 px-5 py-3 text-lg font-normal text-white"
        >
          Home
        </button>
      </div>
    </div>
  )
}

export default SuccessfulPayment
