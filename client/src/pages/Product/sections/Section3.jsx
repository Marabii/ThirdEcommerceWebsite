import React, { useEffect, useState } from 'react'
import CardItem from '../../../components/CardItem'
import axios from 'axios'

const Section3 = (props) => {
  const { productDetails } = props
  const [relatedProducts, setRelatedProducts] = useState([])
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getProducts?isCard=true&&filter=${productDetails.category}`
        )
        const data = response.data
        setRelatedProducts(
          data.filter((product) => product._id !== productDetails._id)
        )
      } catch (e) {
        console.error(e)
        alert('Error Loading Data')
      }
    }
    getRelatedProducts()
  }, [])

  if (!relatedProducts) {
    return <div>Loading...</div>
  }

  return (
    <div className="my-5 flex flex-col items-center space-y-5 sm:block">
      <h2 className="w-fit font-playfair text-5xl font-bold">
        Related Products
      </h2>
      <p className="w-fit text-lg text-gray-500">
        Most Selling and Trending Product
      </p>
      <div className="lg:flex-warp lg:flex lg:gap-5">
        {relatedProducts.map((product) => (
          <CardItem key={product._id} data={product} display={true} />
        ))}
      </div>
    </div>
  )
}

export default Section3
