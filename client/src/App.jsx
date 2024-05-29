import React, { lazy, Suspense, useState, createContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UseAuthCheck from './utils/verifyUser'

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'))
const About = lazy(() => import('./pages/About/About'))
const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const Admin = lazy(() => import('./pages/Admin/Admin'))
const ProductPage = lazy(() => import('./pages/Product/ProductPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'))
const SuccessfulPayment = lazy(
  () => import('./pages/PaymentStatus/SuccessfulPayment')
)
const Profile = lazy(() => import('./pages/Profile/Profile'))

export const globalContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  cartItems: [],
  setCartItems: () => {}
})

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItems, setCartItems] = useState([])

  UseAuthCheck({
    interval: (1 / 2) * 60 * 60 * 1000,
    setIsLoggedIn: setIsLoggedIn,
    setCartItems: setCartItems
  })

  return (
    <globalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, cartItems, setCartItems }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LandingPage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Admin />
              </Suspense>
            }
          />
          <Route
            path="/product-page/:id"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProductPage />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CheckoutPage />
              </Suspense>
            }
          />
          <Route
            path="/successful-payment/:id"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SuccessfulPayment />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </globalContext.Provider>
  )
}

export default App
