import React, { useState } from 'react'
import { X } from 'lucide-react'
import axiosInstance from '../../../utils/verifyJWT'

const VerifyEmail = (props) => {
  const { setShowVerifyEmail, userEmail, userId } = props
  const [isCodeSent, setIsCodeSent] = useState(false)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [verificationCode, setVerificationCode] = useState('')

  const sendVerificationCode = async () => {
    try {
      await axiosInstance.get(
        `${serverURL}/api/verifyEmail?email=${userEmail}&&userId=${userId}`
      )
    } catch (e) {
      console.error(e)
      alert(
        'Error verifying your email, please make sure it is correct and try again'
      )
    }
  }

  const verifyEmailCode = async () => {
    try {
      await axiosInstance.get(
        `${serverURL}/api/verifyEmailCode?code=${verificationCode}&&userId=${userId}`
      )
      window.location.reload
      alert('Your email is verified successfully')
    } catch (e) {
      console.error(e)
      alert('Please try again')
    }
  }

  const handleCodeInput = (e) => {
    setVerificationCode(e.target.value)
  }

  return (
    <div className="absolute left-1/2 top-1/2 z-20 grid -translate-x-1/2 rounded-xl bg-white p-4 shadow-lg">
      <X
        className="absolute right-2 top-2 cursor-pointer"
        onClick={() => setShowVerifyEmail(false)}
      />
      {isCodeSent ? (
        <div className="mt-10 grid space-y-5">
          <h1>Please enter the code recieved in your email down below</h1>
          <input
            onChange={handleCodeInput}
            type="text"
            name="email-verification-code"
            id="email-verification-code"
            className="w-full rounded-xl border border-slate-800 px-2 py-4 text-xl"
          />
          <button
            onClick={verifyEmailCode}
            className="justify-self-center rounded-xl bg-purple-500 px-3 py-4 font-semibold text-white transition-all duration-300 hover:bg-purple-600"
          >
            Verify Your Email
          </button>
        </div>
      ) : (
        <>
          <h1 className="mb-5 mt-5 text-center text-2xl text-slate-800">
            Verify your email so that we can contact you and notify you of any
            news relating to your orders
          </h1>
          <button
            onClick={() => {
              setIsCodeSent(true)
              sendVerificationCode()
            }}
            className="justify-self-center rounded-xl bg-purple-500 px-3 py-4 font-semibold text-white transition-all duration-300 hover:bg-purple-600"
          >
            Send verification code
          </button>
        </>
      )}
    </div>
  )
}

export default VerifyEmail
