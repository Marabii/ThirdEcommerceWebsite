import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import axiosInstance from '../utils/verifyJWT'
import { globalContext } from '../App'
import convertCurrency from '../utils/convertCurrency'

const CartItem = (props) => {
  const { productID, setLoadingStates, updateItemDetails } = props
  const [quantity, setQuantity] = useState()
  const [productData, setProductData] = useState()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [loading, setLoading] = useState(false)
  const { setCartItems } = useContext(globalContext)
  const [priceData, setPriceData] = useState({})

  // In CartItem.js
  useEffect(() => {
    if (priceData && quantity !== undefined) {
      const newDetails = {
        price: priceData.price,
        quantity: quantity,
      }
      updateItemDetails(productID, newDetails)
    }
  }, [priceData, quantity])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getProduct/${productID}`
        )
        setProductData(response.data)
      } catch (e) {
        alert('Error Loading Your Cart')
      }
    }
    getProduct()
  }, [productID])

  // Load initial quantity from the database
  useEffect(() => {
    const getQuantity = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverURL}/api/getUserCart/${productID}`
        )
        const quantityFromServer = response.data.quantity
        setQuantity(quantityFromServer || 1)
      } catch (e) {
        setQuantity(1)
        console.error(e)
      }
    }
    getQuantity()
  }, [productID])

  useEffect(() => {
    if (quantity !== undefined) {
      setLoading(true) // Start loading
      const changeQuantity = async () => {
        try {
          const response = await axiosInstance.post(
            `${serverURL}/api/updateCart?isNewItem=false`,
            { productId: productID, quantity: quantity }
          )
          if (response.status === 200) {
            setLoading(false) // Stop loading after successful update
          } else {
            throw new Error('Server Error')
          }
        } catch (e) {
          alert('Cannot set that quantity')
          console.error(e)
          setLoading(false) // Stop loading on error
        }
      }
      changeQuantity()
    }
  }, [quantity])

  useEffect(() => {
    setLoadingStates(loading)
  }, [loading])

  useEffect(() => {
    const getCorrectPrice = async () => {
      const result = await convertCurrency(productData.price)
      setPriceData(result)
    }

    if (productData) getCorrectPrice()
  }, [productData])

  const handleQuantityChange = (e) => {
    const quantityInput = parseInt(e.target.value, 10)
    if (quantityInput >= productData.stock) {
      setQuantity(productData.stock)
    } else if (quantityInput < 1) {
      setQuantity(1)
    } else {
      setQuantity(quantityInput)
    }
  }

  const handleRemoveCartItem = async () => {
    try {
      const response = await axiosInstance.delete(
        `${serverURL}/api/deleteCartItem/${productID}`
      )
      const cartItems = response.data.cartItems
      setCartItems(cartItems)
    } catch (error) {
      console.error('Failed to delete cart item:', error)
      alert("Can't delete cart item")
    }
  }

  if (!productData || quantity === undefined || !priceData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={loading ? 'opacity-40' : 'opacity-100'}>
        <img
          src={productData.productThumbnail}
          alt="cart-item"
          className="h-auto w-[80px]"
        />
      </div>
      <div
        className={`flex w-full items-center justify-between font-jost ${loading ? 'opacity-40' : 'opacity-100'}`}
      >
        <div>
          <h3 className="mb-2 font-bold text-gray-500">{productData.name}</h3>
          <p className="py-2 text-gray-500">
            {priceData.price?.toFixed(2)} {priceData.currency}{' '}
          </p>
          <button
            onClick={handleRemoveCartItem}
            className="border-b-2 border-red-600 pb-[1px] text-red-600 transition-all duration-200 hover:font-bold"
          >
            Remove
          </button>
        </div>
        <input
          type="number"
          name="quantity"
          id="quantity"
          min={1}
          max={productData.stock}
          onChange={handleQuantityChange}
          value={quantity}
          className="h-fit w-[50px] rounded-md border border-gray-400 p-2"
        />
      </div>
    </>
  )
}

export default CartItem
