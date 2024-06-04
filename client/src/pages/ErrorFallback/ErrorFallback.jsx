const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error(error)

  const home = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_CLIENT
  }
  return (
    <div>
      <h1>Something went wrong:</h1>
      <button onClick={home}>Go Back Home</button>
    </div>
  )
}

export default ErrorFallback
