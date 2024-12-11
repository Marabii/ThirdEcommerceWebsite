import { useState, useContext, useEffect } from 'react'
import axiosInstance from '../../../utils/verifyJWT'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { globalContext } from '../../../App'

const ChangePersonalDetails = () => {
  const userData = useContext(globalContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setName(userData?.userData?.username)
    setEmail(userData?.userData?.email)
  }, [userData])

  useEffect(() => {
    setTimeout(() => {
      if (Object.keys(userData).length === 0) {
        window.location.reload()
      }
    }, 5000)
  }, [])

  const handleSaveChanges = async () => {
    try {
      await axiosInstance.post('/api/updateUser', { name, email })
      toast.success('Details updated successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Failed to update user details:', error)
      toast.error('Failed to update details. Please try again.')
    }
  }

  const handleCancelChanges = () => {
    if (
      userData?.userData?.email !== email ||
      userData?.userData?.username !== name
    ) {
      if (window.confirm('Are you sure you want to discard these changes?')) {
        setName(userData?.userData?.username)
        setEmail(userData?.userData?.email)
      }
    }
  }

  if (Object.keys(userData).length === 0) {
    return <div>Loading ...</div>
  }

  return (
    <div className="justify-between md:flex">
      <div className="mb-10 md:w-1/4">
        <h2 className="text-lg font-semibold text-slate-800">Personal Info</h2>
        <p className="w-full text-sm font-semibold text-slate-500">
          Update your personal details
        </p>
      </div>
      <div className="w-full max-w-[700px] rounded-md border border-slate-400">
        <div className="space-y-5">
          <div className="space-y-2 p-4">
            <label
              htmlFor="full_name"
              className="block text-lg font-semibold text-slate-800"
            >
              Full name
            </label>
            <input
              className="w-full rounded-lg border border-slate-500 px-4 py-2"
              type="text"
              name="full_name"
              id="full_name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="px-4">
            <label
              className="block text-lg font-semibold text-slate-800"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-slate-500 px-4 py-2"
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-10 flex w-full justify-end space-x-2 border-t border-slate-400 p-2">
          <button
            onClick={handleCancelChanges}
            className="rounded-md border-2 border-slate-500 bg-slate-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Cancel
          </button>
          <button
            className="rounded-md border-2 border-slate-500 px-4 py-3 font-semibold transition-all duration-300 hover:bg-slate-500 hover:text-white"
            onClick={handleSaveChanges}
          >
            Save changes
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ChangePersonalDetails
