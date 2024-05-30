import React from 'react'

const ChangePersonalDetails = () => {
  return (
    <div className="justify-between md:flex">
      <div className="mb-10 md:w-1/4">
        <h2 className="text-lg font-semibold text-slate-800">Personal Info</h2>
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
  )
}

export default ChangePersonalDetails
