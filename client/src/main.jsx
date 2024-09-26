import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.jsx'
import './index.css'
import ErrorFallback from './pages/ErrorFallback/ErrorFallback.jsx'
import Header from './components/Header.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Logging error:', error, info)
      }}
    > */}
      <App />
    {/* </ErrorBoundary> */}
  </React.StrictMode>
)
