import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.jsx'
import './index.css'

function ErrorFallback({ error, resetErrorBoundary }) {
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Perform application reload
    window.location.reload()
  }

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Logging error:', error, info)
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
