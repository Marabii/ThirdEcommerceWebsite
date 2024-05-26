import React, { useEffect, useState } from 'react'

const ProductDetailsJSX = (props) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
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
        <button className="mt-10 w-[150px] border-2 border-black px-5 py-2">
          ADD TO CART
        </button>
      </div>
    </>
  )
}

export default ProductDetailsJSX
