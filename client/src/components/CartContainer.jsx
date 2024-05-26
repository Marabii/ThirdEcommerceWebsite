import React, { useContext, useEffect, useState } from 'react'
import { globalContext } from '../App.jsx'
import { X } from 'lucide-react'
import CartItem from './CartItem.jsx'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/verifyJWT.jsx'

const CartContainer = (props) => {
  const { isLoggedIn, cartItems } = useContext(globalContext)
  const { isCartOpen, setIsCartOpen } = props
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [loadingStates, setLoadingStates] = useState(false)
  const [itemDetails, setItemDetails] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const total = Object.values(itemDetails).reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0
    )
    setTotalPrice(total.toFixed(2))
  }, [itemDetails])

  if (!isCartOpen) {
    return null
  }

  const checkoutFunc = () => {
    navigate('/checkout')
  }

  const updateItemDetails = (productId, details) => {
    setItemDetails((prev) => ({
      ...prev,
      [productId]: details
    }))
  }

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-black bg-opacity-80"
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className="fixed right-0 top-0 z-20 h-screen min-w-[350px] bg-white">
        <X
          className="absolute right-5 top-7 cursor-pointer"
          onClick={() => setIsCartOpen(false)}
        />
        {isLoggedIn ? (
          <>
            <h1 className="border-b border-gray-400 p-5 pb-5 text-2xl font-bold">
              Your Cart
            </h1>
            <div className="flex h-full flex-col justify-between">
              <div
                style={{ maxHeight: 'calc(100vh - 200px)' }}
                className="overflow-y-auto"
              >
                {cartItems.length !== 0 ? (
                  <div>
                    {cartItems.map((item) => {
                      const productID = item['productId']
                      return (
                        <div
                          key={productID}
                          className="flex h-fit w-full items-center space-x-3 px-5 py-3"
                        >
                          <CartItem
                            productID={productID}
                            updateItemDetails={updateItemDetails}
                            setLoadingStates={setLoadingStates}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-5 text-center">No Items Found</div>
                )}
              </div>
              <div className="h-[200px] w-full border-t border-gray-500 p-5">
                <div className="flex justify-between pb-2 font-jost">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-semibold ">$ {totalPrice} USD</p>
                </div>
                <button
                  className={`w-full bg-blue-400 py-5 font-semibold text-white transition-all duration-200 hover:bg-blue-500 ${loadingStates ? 'opacity-20' : 'opacity-100'}`}
                  onClick={checkoutFunc}
                  disabled={loadingStates}
                >
                  Continue To Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center space-y-5">
            <p className="text-xl font-bold">Login to see your cart</p>
            <button
              className="rounded-md bg-gray-200 px-5 py-3 font-jost text-gray-500 transition-all duration-300 hover:bg-gray-400 hover:text-white"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartContainer
