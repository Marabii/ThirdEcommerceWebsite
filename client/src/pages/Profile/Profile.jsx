import React, { useState, useContext } from 'react'
import TopSection from '../../components/TopSection.jsx'
import { useParams, useSearchParams } from 'react-router-dom'
import VerifyEmailPanel from './sections/VerifyEmailPanel.jsx'
import { globalContext } from '../../App'
import Header from '../../components/Header.jsx'
import ChangePersonalDetails from './sections/ChangePersonalDetails.jsx'
import CheckOrders from './sections/CheckOrders.jsx'

const Profile = () => {
  const userId = useParams().id
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)
  const { userData } = useContext(globalContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const currPage = parseInt(searchParams.get('page')) || 0

  const changePage = (newPage) => {
    setSearchParams({ page: newPage })
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
      <Header />
      <div className="relative mb-10 aspect-[2/0.7] w-full md:aspect-[2/0.4]">
        <TopSection
          data={{
            title: 'Profile',
            description:
              'You can change all your personal information from here as well as check your orders'
          }}
        />
      </div>
      <div className="space-y-7 px-4">
        <ul className="text-normal flex items-center justify-center gap-10 font-semibold md:text-xl">
          <li>
            <button
              onClick={() => changePage(0)}
              className={`rounded-md border-2 border-slate-500 px-4 py-3 transition-all duration-300 hover:bg-slate-500 hover:text-white ${currPage === 0 && 'bg-slate-500 font-bold text-white'}`}
            >
              Change personal details
            </button>
          </li>
          <li>
            <button
              onClick={() => changePage(1)}
              className={`rounded-md border-2 border-slate-500 px-4 py-3 ${currPage === 1 && 'bg-slate-500 font-bold text-white'} transition-all duration-300 hover:bg-slate-500 hover:text-white`}
            >
              Check orders
            </button>
          </li>
        </ul>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            {userData.username}
          </h2>
          <h3 className="text-sm font-semibold text-slate-500">
            {userData.email}{' '}
            <span>
              {userData.isEmailVerified ? (
                <div className="text-green-500">Your email is verified</div>
              ) : (
                <button
                  className="block border-b border-red-500 text-red-500"
                  onClick={() => setShowVerifyEmail(true)}
                >
                  Verify Email
                </button>
              )}
            </span>
          </h3>
        </div>
        {currPage === 0 ? (
          <ChangePersonalDetails />
        ) : (
          <CheckOrders userId={userId} />
        )}
      </div>
    </div>
  )
}

export default Profile
