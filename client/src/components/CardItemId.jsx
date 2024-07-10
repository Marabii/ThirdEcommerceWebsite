import React, { useState, useContext, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { globalContext } from '../App'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/verifyJWT'
import axios from 'axios'

const CardItemId = (props) => {
  const { productId, display, width, setLoaded, loaded } = props
  const [data, setData] = useState()
  const [showAddToCart, setShowAddToCart] = useState(false)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const clientURL = import.meta.env.VITE_REACT_APP_CLIENT
  const oldPrice = Number(data?.price || 0) * (1 + data?.promo / 100 || 0)
  const { isLoggedIn, setCartItems } = useContext(globalContext)
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('You must log in before you can buy items')
      navigate('/login')
      return
    }

    if (data.stock === 0) {
      return alert('Sorry, we are out of stock')
    }

    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.productId === data._id)
      if (itemExists) {
        alert('Item already exists in your cart')
        return prev
      } else {
        return [...prev, { productId: data._id, quantity: 1 }]
      }
    })

    try {
      const response = await axiosInstance.post(
        `${serverURL}/api/updateCart?isNewItem=true`,
        { productId: data._id, quantity: 1 }
      )
      if (response.status !== 200) {
        throw new Error('Failed to update cart')
      }
    } catch (e) {
      console.error(e)
      setCartItems((prev) => prev.filter((item) => item.productId !== data._id))
      alert('Failed to update cart. Please try again.')
    }
  }

  useEffect(() => {
    const getProductData = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getProduct/${productId}`
        )
        const data = response.data
        setLoaded(true)
        setData(data)
      } catch (e) {
        console.error(e)
        alert('unable to get product')
      }
    }
    getProductData()
  }, [])

  if (!data) {
    return
  }

  return (
    <div
      style={{ width: width ? `${width}px` : 'fit-content' }}
      key={data._id}
      className={`mb-5 cursor-pointer shadow-xl`}
    >
      <div
        onMouseEnter={() => setShowAddToCart(true)}
        onMouseLeave={() => setShowAddToCart(false)}
        className={`relative aspect-square w-full max-w-[400px] ${loaded && 'h-[420px] animate-pulse rounded-md'} bg-gray-400`}
      >
        {data.promo !== 0 && (
          <div className="text-playfair absolute left-2 top-2 bg-gray-100 px-4 py-2 font-semibold text-gray-600">
            Promo: <span className="text-red-500">{data.promo}%</span> off
          </div>
        )}
        {data.stock === 0 && (
          <div className="text-playfair absolute right-2 top-2 bg-gray-100 px-4 py-2 font-semibold text-gray-600">
            Out Of Stock
          </div>
        )}
        <a href={`${clientURL}/product-page/${data._id}`}>
          <img
            className="aspect-square w-full max-w-[400px]"
            src={`${serverURL}/products/${data._id}.png`}
            alt="card-img"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </a>
        <AnimatePresence>
          {showAddToCart && display && (
            <motion.div
              initial={{ x: '-50%', y: -20 }}
              animate={{ x: '-50%', y: 0 }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              onClick={handleAddToCart}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-100 px-4 py-2 font-semibold text-gray-500"
            >
              Add To Cart
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <h2 className="mb-4 w-fit p-2 font-playfair text-2xl font-semibold">
        {data.name}
      </h2>
      <h3 className="w-fit p-2 text-lg font-semibold">
        $ {data.price} USD{' '}
        {oldPrice !== 0 && data.promo !== 0 && (
          <span className="font-normal text-slate-400 line-through">
            ${oldPrice.toFixed()} USD
          </span>
        )}
      </h3>
    </div>
  )
}

export default CardItemId
