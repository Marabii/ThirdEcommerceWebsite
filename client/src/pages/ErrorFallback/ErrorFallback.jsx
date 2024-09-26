import React from 'react'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error(error)

  const home = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_CLIENT
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-red-600">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-800">
          We're sorry for the inconvenience. Please try refreshing the page, or
          you can return to the homepage.
        </p>
        <div className="flex justify-center">
          <button
            onClick={home}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback
