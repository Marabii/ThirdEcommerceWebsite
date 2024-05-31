const ErrorFallback = ({ error, resetErrorBoundary }) => {
  window.location.href = import.meta.env.VITE_REACT_APP_CLIENT

  return <></>
}

export default ErrorFallback
