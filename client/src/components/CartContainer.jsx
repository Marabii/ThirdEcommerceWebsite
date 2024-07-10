import React, { useContext, useEffect, useState } from 'react'
import { globalContext } from '../App.jsx'
import { X } from 'lucide-react'
import CartItem from './CartItem.jsx'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const CartContainer = (props) => {
  const { isLoggedIn, cartItems, userData } = useContext(globalContext)
  const { isCartOpen, setIsCartOpen } = props
  const navigate = useNavigate()
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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const cartVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 }
  }

  if (!isCartOpen) {
    return null
  }

  const checkoutFunc = () => {
    if (userData.isEmailVerified) {
      navigate('/checkout')
    } else {
      alert('Your email is not verified. Please verify it to continue')
      navigate(`/profile/${userData._id}`)
    }
  }

  const updateItemDetails = (productId, details) => {
    setItemDetails((prev) => ({
      ...prev,
      [productId]: details
    }))
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-10 bg-black bg-opacity-80"
            onClick={() => setIsCartOpen(false)}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          ></motion.div>
          <motion.div
            className="fixed right-0 top-0 z-20 h-screen min-w-[350px] bg-white"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
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
                            <motion.div
                              key={productID}
                              className="flex h-fit w-full items-center space-x-3 px-5 py-3"
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: 'spring', stiffness: 120 }}
                            >
                              <CartItem
                                productID={productID}
                                updateItemDetails={updateItemDetails}
                                setLoadingStates={setLoadingStates}
                              />
                            </motion.div>
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
                      <p className="font-semibold">$ {totalPrice} USD</p>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartContainer
