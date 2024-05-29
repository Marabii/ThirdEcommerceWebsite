import React, { useEffect, useState } from 'react'
import { MenuSquareIcon } from 'lucide-react'
import axiosInstance from '../../utils/verifyJWT'
import { useParams } from 'react-router-dom'
import VerifyEmailPanel from './sections/VerifyEmailPanel.jsx'

const Profile = () => {
  const userId = useParams().id
  const [userData, setUserData] = useState()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)

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

  const verifyEmail = async () => {
    return
  }

  if (!userData) {
    return <div>Loading ....</div>
  }

  return (
    <div className="relative pb-10">
      {showVerifyEmail && (
        <>
          <div
            onClick={() => setShowVerifyEmail(false)}
            className="absolute inset-0 z-10 bg-black bg-opacity-50"
          ></div>
          <VerifyEmailPanel
            userEmail={userData.email}
            setShowVerifyEmail={setShowVerifyEmail}
            userId={userId}
          />
        </>
      )}
      <header className="mb-10 flex w-full items-center justify-between p-5 md:hidden">
        <div className="flex items-center gap-5 rounded-lg border border-gray-800 p-2 shadow-md">
          <img width={100} src="/farnic.png" alt="farnic logo" />
          <h1 className="text-xl font-semibold text-gray-800">Your Profile</h1>
        </div>
        <MenuSquareIcon size={35} />
      </header>
      <div className="relative mb-24 aspect-[2/0.7] w-full md:aspect-[2/0.4]">
        <div className="modern-gradient absolute inset-0 opacity-40"></div>
        <img
          className="absolute top-[100%] aspect-square max-w-[150px] -translate-y-1/2 translate-x-3 rounded-full border-4 border-white shadow-lg"
          src="/user.png"
          alt="profile image"
        />
      </div>
      <div className="space-y-7 px-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            {userData.username}
          </h2>
          <h3 className="text-sm font-semibold text-slate-500">
            {userData.email}
          </h3>
        </div>
        <div>
          {userData.isEmailVerified ? (
            <p className="rounded-md bg-green-500 p-2 text-white">
              Your email is verified
            </p>
          ) : (
            <div>
              <p className="rounded-md bg-red-500 p-2 text-white">
                Your Email Is Not Verified
              </p>
              <button
                onClick={() => setShowVerifyEmail(true)}
                className="mt-4 cursor-pointer rounded-md bg-red-400 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-red-600"
              >
                Verify Email
              </button>
            </div>
          )}
        </div>
        <div className="justify-between md:flex">
          <div className="mb-10 md:w-1/4">
            <h2 className="text-lg font-semibold text-slate-800">
              Personal Info
            </h2>
            <p className="w-full text-sm font-semibold text-slate-500">
              Update your photo and personal details
            </p>
          </div>
          <div className="w-full max-w-[700px] rounded-md border border-slate-400">
            <div className="space-y-5">
              <div className="space-y-2 p-4">
                <label
                  htmlFor="input:text"
                  className="block text-lg font-semibold text-slate-800"
                >
                  Full name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-500 px-4 py-5"
                  type="text"
                  name="full_name"
                  id="full_name"
                  placeholder="Full name"
                />
              </div>
              <div className="px-4">
                <label
                  className="block text-lg font-semibold text-slate-800"
                  htmlFor="input:text"
                >
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-slate-500 px-4 py-5"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="email"
                />
              </div>
            </div>
            <div className="mt-10 flex w-full justify-end space-x-2 border-t border-slate-400 p-2">
              <button className="rounded-lg border border-slate-500 px-5 py-2">
                Cancel
              </button>
              <button className="rounded-lg bg-purple-500 px-5 py-2 text-white transition-all duration-300 hover:bg-purple-600">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
