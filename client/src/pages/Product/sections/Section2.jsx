import React, { useState } from 'react'

const Section2 = (props) => {
  const [details, setDetails] = useState('product-details')
  const { productDetails } = props

  return (
    <>
      <div className="flex flex-wrap gap-6 py-5 pb-10 font-playfair text-xl font-semibold">
        <button
          className={`${details === 'product-details' ? 'text-black' : 'text-gray-600'}`}
          onClick={() => setDetails('product-details')}
        >
          <h2>Product Details</h2>
        </button>
        <button
          className={`${details === 'specifications' ? 'text-black' : 'text-gray-600'}`}
          onClick={() => setDetails('specifications')}
        >
          <h2>Specifications</h2>
        </button>
      </div>
      {details === 'product-details' && (
        <p className="text-lg leading-9 text-gray-600">
          {productDetails.productDetails}
        </p>
      )}
      {details === 'specifications' && (
        <div className="space-y-4 pb-10 text-xl">
          <div className="flex items-center gap-3">
            <h4 className="font-semibold">Weight (oz): </h4>
            <p className="text-gray-600">
              {productDetails.specification.weight}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold">Width (inch): </h4>
            <p className="text-gray-600">
              {productDetails.specification.width}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold">height (inch): </h4>
            <p className="text-gray-600">
              {productDetails.specification.height}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold">Length (inch): </h4>
            <p className="text-gray-600">
              {productDetails.specification.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Section2
