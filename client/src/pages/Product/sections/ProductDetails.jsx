import { useContext, useState } from 'react'
import { globalContext } from '../../../App'
import axiosInstance from '../../../utils/verifyJWT'

const ProductDetailsJSX = (props) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const { isLoggedIn, setCartItems } = useContext(globalContext)
  const { productDetails } = props
  const [quantity, setQuantity] = useState(1)
  const oldPrice = Number(productDetails?.price) * 1.2

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value)
    if (value < 0) {
      setQuantity(1)
      return
    } else if (value > productDetails.stock) {
      setQuantity(productDetails.stock)
      return
    }
    setQuantity(e.target.value)
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('You must log in before you can buy items')
      navigate('/login')
      return
    }

    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item.productId === productDetails._id
      )
      if (itemExists) {
        alert('Item already exists in your cart')
        return prev
      } else {
        return [...prev, { productId: productDetails._id, quantity: 1 }]
      }
    })

    try {
      const response = await axiosInstance.post(
        `${serverURL}/api/updateCart?isNewItem=true`,
        { productId: productDetails._id, quantity: 1 }
      )
      if (response.status !== 200) {
        throw new Error('Failed to update cart')
      }
    } catch (e) {
      console.error(e)
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productDetails._id)
      )
      alert('Failed to update cart. Please try again.')
    }
  }

  return (
    <>
      <img
        src={`${serverURL}/products/${productDetails._id}.png`}
        className="self-center justify-self-center md:col-start-1 md:col-end-2"
        alt="product image"
        loading="lazy"
      />
      <div className="col-start-2 col-end-3 space-y-4">
        <h2 className="font-playfair text-5xl font-bold">
          {productDetails.name}
        </h2>
        <p className="text-lg font-semibold">
          $ {productDetails.price} USD{' '}
          <span className="ml-3 text-gray-500 line-through">
            $ {oldPrice.toFixed(2)} USD
          </span>
        </p>
        <p className="text-lg leading-8 text-gray-600">
          {productDetails.description}
        </p>
        <div className="mt-10 flex items-center gap-5">
          <h4 className="font-playfair text-3xl">Delivery: </h4>
          <p className="relative top-[2px] text-xl">
            {productDetails.delivery}
          </p>
        </div>
        <div className="mt-10 flex items-center gap-5">
          <h4 className="font-playfair text-3xl">Stock: </h4>
          <p className="relative top-[2px] text-xl">{productDetails.stock}</p>
        </div>
        <div className="mt-10 flex items-center gap-5">
          <h4 className="font-playfair text-3xl">Quantity: </h4>
          <input
            type="number"
            className="relative top-[2px] text-xl"
            min={0}
            max={productDetails.stock}
            onChange={handleQuantityChange}
            value={quantity}
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-10 w-[150px] border-2 border-black px-5 py-2"
        >
          ADD TO CART
        </button>
      </div>
    </>
  )
}

export default ProductDetailsJSX
