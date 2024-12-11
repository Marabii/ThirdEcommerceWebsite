import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { globalContext } from '../App'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/verifyJWT'
import convertCurrency from '../utils/convertCurrency'
import log from '../utils/logger'

/**
 * CardItem Component
 *
 * Displays a product card with image, name, price, and an option to add the item to the cart.
 * Handles user interactions such as adding items to the cart, displaying promotional information,
 * and managing stock status.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Data object containing product details.
 * @param {boolean} props.display - Flag to determine if "Add to Cart" button should be displayed on hover.
 * @param {number} [props.width] - Optional width for the card in pixels. Defaults to 'fit-content' if not provided.
 *
 * @returns {JSX.Element} The rendered CardItem component.
 */
const CardItem = (props) => {
  const { data, display, width } = props

  // Environment variables for server and client URLs
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const clientURL = import.meta.env.VITE_REACT_APP_CLIENT

  // State to manage the visibility of the "Add to Cart" button
  const [showAddToCart, setShowAddToCart] = useState(false)

  // Access global context for authentication status and cart management
  const { isLoggedIn, setCartItems } = useContext(globalContext)

  // Navigation hook from react-router-dom
  const navigate = useNavigate()

  // State to track if the product image has loaded
  const [imageLoaded, setImageLoaded] = useState(false)

  // State to store converted price data based on currency
  const [priceData, setPriceData] = useState({})

  // State to store the original price before any promotional discount
  const [oldPrice, setOldPrice] = useState(0)

  /**
   * Handles the addition of the current product to the user's cart.
   * Validates user authentication and product stock before proceeding.
   * Updates the global cart state and communicates with the server to persist changes.
   */
  const handleAddToCart = async () => {
    log.info('handleAddToCart initiated')

    if (!isLoggedIn) {
      log.warn('User not logged in. Redirecting to login page.')
      alert('You must log in before you can buy items')
      navigate('/login')
      return
    }

    if (data.stock === 0) {
      log.warn('Attempted to add out-of-stock item to cart')
      alert('Sorry, we are out of stock')
      return
    }

    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.productId === data._id)
      if (itemExists) {
        log.info('Item already exists in cart')
        alert('Item already exists in your cart')
        return prev
      } else {
        log.info('Adding new item to cart')
        return [...prev, { productId: data._id, quantity: 1 }]
      }
    })

    try {
      const response = await axiosInstance.post(
        `${serverURL}/api/updateCart?isNewItem=true`,
        { productId: data._id, quantity: 1 }
      )
      if (response.status === 200) {
        log.info('Cart updated successfully')
      } else {
        throw new Error('Failed to update cart')
      }
    } catch (e) {
      log.error('Error updating cart:', e)
      setCartItems((prev) => prev.filter((item) => item.productId !== data._id))
      alert('Failed to update cart. Please try again.')
    }
  }

  /**
   * Effect hook to fetch and convert the product price based on the user's currency.
   * Also calculates the original price if a promotional discount is applied.
   */
  useEffect(() => {
    const getCorrectPrice = async () => {
      const result = await convertCurrency(data.price)
      setPriceData(result)

      // Calculate old price based on promotional discount
      if (data.promo && data.promo > 0) {
        const oldPriceValue = Number(result.price) / (1 - data.promo / 100)
        setOldPrice(oldPriceValue)
      } else {
        setOldPrice(0)
      }
    }

    if (data.price) getCorrectPrice()
  }, [data])

  return (
    <div
      style={{ width: width ? `${width}px` : 'fit-content' }}
      key={data._id}
      className="mb-5 cursor-pointer shadow-xl"
    >
      <div
        onMouseEnter={() => setShowAddToCart(true)}
        onMouseLeave={() => setShowAddToCart(false)}
        className={`relative aspect-square w-full max-w-[400px] ${
          !imageLoaded && 'h-[420px] animate-pulse rounded-md'
        } bg-gray-400`}
      >
        {/* Display promotional badge if applicable */}
        {data.promo && data.promo !== 0 && (
          <div className="text-playfair absolute left-2 top-2 bg-gray-100 px-4 py-2 font-semibold text-gray-600">
            Promo: <span className="text-red-500">{data.promo}%</span> off
          </div>
        )}

        {/* Display out-of-stock badge if the product is unavailable */}
        {data.stock && data.stock === 0 && (
          <div className="text-playfair absolute right-2 top-2 bg-gray-100 px-4 py-2 font-semibold text-gray-600">
            Out Of Stock
          </div>
        )}

        {/* Product Image with link to the product page */}
        <a href={`${clientURL}/product-page/${data._id}`}>
          <img
            className="aspect-square w-full max-w-[400px]"
            src={data.productThumbnail}
            alt="card-img"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </a>

        {/* Animated "Add To Cart" button displayed on hover */}
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

      {/* Product Name */}
      <h2 className="mb-4 w-fit p-2 font-playfair text-2xl font-semibold">
        {data.name}
      </h2>

      {/* Product Price and Original Price if on promotion */}
      <h3 className="w-fit p-2 text-lg font-semibold">
        {priceData.price?.toFixed(2)} {priceData.currency}{' '}
        {oldPrice !== 0 && (
          <span className="font-normal text-slate-400 line-through">
            {oldPrice?.toFixed(2)} {priceData.currency}
          </span>
        )}
      </h3>
    </div>
  )
}

export default CardItem
