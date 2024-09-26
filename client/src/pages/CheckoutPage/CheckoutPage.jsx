import React, { useContext, useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { globalContext } from '../../App'
import CardItemId from '../../components/CardItemId'
import axiosInstance from '../../utils/verifyJWT'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'

const CheckoutPage = () => {
  const [loaded, setLoaded] = useState(true)
  const navigate = useNavigate()
  const { cartItems, userData } = useContext(globalContext)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const clientURL = import.meta.env.VITE_REACT_APP_CLIENT
  const userId =
    Object.keys(userData).length !== 0
      ? userData._id
      : (window.location.href = clientURL)
  const items = cartItems.map((item) => {
    return { id: item.productId, quantity: item.quantity }
  })
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    street: '',
    city: '',
    zipcode: '',
    userId: userId
  })

  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsPromises = cartItems.map((item) =>
          axiosInstance.get(`${serverURL}/api/getProduct/${item.productId}`)
        )
        const products = await Promise.all(productsPromises)
        products.forEach((product) => {
          if (product.data.stock == 0) {
            alert('Sorry, one of the items in your cart is out of stock')
            handleRemoveCartItem(product.data._id)
            if (
              !window.confirm(
                'Would you like to proceed with checkout without this item: ' +
                  product.data.name
              )
            ) {
              navigate('/')
            }
          } else if (
            product.data.stock <
            cartItems.filter((item) => item.productId === product.data._id)[0]
              .quantity
          ) {
            alert(
              `Sorry, you can only buy ${product.data.stock} items of ${product.data.name}`
            )
            if (window.confirm('Would you like to proceed with checkout?')) {
              handleChangeQuantity(product.data._id, product.data.stock)
            } else {
              handleRemoveCartItem(product.data._id)
              navigate('/')
            }
          }
        })
      } catch (error) {
        console.error('Failed to get products:', error)
      }
    }

    getProducts()
  }, [cartItems])

  async function handleRemoveCartItem(productID) {
    try {
      await axiosInstance.delete(`${serverURL}/api/deleteCartItem/${productID}`)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete cart item:', error)
      alert("Can't delete cart item")
    }
  }

  async function handleChangeQuantity(productID, quantity) {
    try {
      await axiosInstance.post(`${serverURL}/api/updateCart?isNewItem=false`, {
        productId: productID,
        quantity: quantity
      })
    } catch (e) {
      alert('Cannot set that quantity')
      console.error(e)
    }
  }

  const useDebounce = (callback, delay) => {
    const [timer, setTimer] = useState(null)

    const debouncedCallback = (...args) => {
      if (timer) clearTimeout(timer)
      const newTimer = setTimeout(() => {
        callback(...args)
      }, delay)
      setTimer(newTimer)
    }

    return debouncedCallback
  }

  const validateField = (name, value) => {
    const validations = {
      first_name: {
        regex: /^[a-zA-Z]{2,30}$/,
        error:
          'First name must be between 2 and 30 letters and contain no numbers or special characters.'
      },
      last_name: {
        regex: /^[a-zA-Z]{2,30}$/,
        error:
          'Last name must be between 2 and 30 letters and contain no numbers or special characters.'
      },
      phone_number: {
        regex: /^\+?[0-9]{7,15}$/,
        error:
          "Phone number must be between 7 and 15 digits and may start with a '+'."
      },
      street: {
        regex: /^[a-zA-Z0-9\s,'-]{3,100}$/,
        error:
          'Street must be between 3 and 100 characters long and can include letters, numbers, spaces, commas, and hyphens.'
      },
      city: {
        regex: /^[a-zA-Z\s]{2,50}$/,
        error:
          'City should only contain letters and spaces, and be between 2 and 50 characters long.'
      },
      zipcode: {
        regex: /^[0-9]{5}(-[0-9]{4})?$/,
        error:
          'Zip code must be a 5-digit number or a 9-digit format with a dash.'
      }
    }

    const fieldValidation = validations[name]

    if (!fieldValidation.regex.test(value)) {
      alert(
        `${name.split('_').join(' ').toUpperCase()} is invalid: ${fieldValidation.error}`
      )
      setFormData((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const debouncedValidation = useDebounce(validateField, 400)

  const handleFormData = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    debouncedValidation(name, value)
  }

  const checkoutFunc = async () => {
    const { first_name, last_name, phone_number, street, city, zipcode } =
      formData
    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !street ||
      !city ||
      !zipcode
    ) {
      alert('Please fill in all fields correctly.')
      return
    }

    try {
      const response = await axiosInstance.post(
        `${serverURL}/api/create-checkout-session`,
        { items: items, metadata: formData }
      )
      const url = response.data.url
      window.location.href = url
    } catch (e) {
      alert('Error during checkout')
      console.error(e)
      navigate('/')
    }
  }

  return (
    <div className="relative grid justify-center p-3 text-center">
      <Header />
      <div className="mt-[100px] space-y-5">
        <div className="flex space-x-1">
          <ShieldCheck stroke="white" fill="rgb(88 28 135)" />
          <p>30 DAY MONEY BACK GUARANTEE</p>
        </div>
        <h1 className="text-balance text-3xl font-semibold text-purple-900">
          You're almost there! Complete your order
        </h1>
      </div>
      <p className="my-[20px]">Chosen Product{cartItems.length > 1 && 's'}: </p>
      <div className="flex flex-col items-center">
        {cartItems.map((item) => {
          return (
            <CardItemId
              key={item.productId}
              productId={item.productId}
              display={false}
              width={250}
              setLoaded={setLoaded}
              loading={loaded}
            />
          )
        })}
      </div>
      <div className="mb-15 max-w-[700px] space-y-5">
        <p className="text-2xl font-semibold text-purple-900">
          Please fill this form
        </p>
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0">
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            required
            onChange={handleFormData}
            value={formData.first_name}
            className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
          />
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            required
            onChange={handleFormData}
            value={formData.last_name}
            className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
          />
        </div>
        <input
          type="text"
          name="phone_number"
          id="phone_number"
          placeholder="Phone Number"
          required
          onChange={handleFormData}
          value={formData.phone_number}
          className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
        />
        <div className="space-y-3">
          <input
            type="text"
            name="street"
            id="street"
            placeholder="Street"
            required
            onChange={handleFormData}
            value={formData.street}
            className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
          />
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            required
            onChange={handleFormData}
            value={formData.city}
            className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
          />
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            placeholder="Zip Code"
            required
            onChange={handleFormData}
            value={formData.zipcode}
            className="w-full rounded-md border-2 border-gray-200 px-2 py-3 font-jost text-lg"
          />
        </div>
      </div>
      <button
        onClick={checkoutFunc}
        className="my-5 rounded-lg bg-purple-900 py-4 text-xl font-semibold text-white transition-all duration-300 hover:bg-purple-800"
      >
        PAY
      </button>
    </div>
  )
}

export default CheckoutPage
