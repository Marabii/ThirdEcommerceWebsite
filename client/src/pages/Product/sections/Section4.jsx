import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Section4 = ({ id }) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const navigate = useNavigate()
  const [data, setData] = useState()
  const [productData, setProductData] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/exploreAll`)
        const data = response.data
        setData(data)
      } catch (e) {
        console.error(e)
        alert('Error Loading Data')
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/getProduct/${id}`)
        const data = response.data
        setProductData(data)
      } catch (e) {
        console.error(e)
        alert('Error Loading Data')
      }
    }
    fetchProducts()
  }, [id])

  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-5 2xl:col-start-3 2xl:col-end-4 2xl:row-start-1 2xl:row-end-3">
      <div>
        <p className="font-playfair text-2xl">Categories</p>
        <div className="mt-5 flex flex-col gap-5">
          {data.categories.map((category) => {
            return (
              <button
                onClick={() => navigate(`/shop?filter=${category}`)}
                className="w-fit text-lg font-light capitalize"
                key={category}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
      <div className="relative h-auto w-full">
        <img src="/chair2.jpg" alt="chairs" className="w-full max-w-[600px]" />
        <div className="absolute bottom-5 left-3 space-y-2 text-white">
          <p className="text-sm">MEGA SALE UP TO 75%</p>
          <h2 className="font-playfair text-2xl">Fancy Sofa Set</h2>
          <button
            onClick={() => navigate('/shop')}
            className="border-b-2 border-white"
          >
            SHOP NOW
          </button>
        </div>
      </div>
      <div>
        <p className="font-playfair text-2xl">Materials</p>
        <div className="mt-5 flex flex-col gap-5">
          {data?.materials?.map((material) => {
            return (
              <button
                onClick={() => navigate(`/shop?material=${material}`)}
                className="w-fit text-lg font-light capitalize"
                key={material}
              >
                {material}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <p className="font-playfair text-2xl">Tags</p>
        <div className="mt-5 flex flex-wrap gap-5">
          {productData?.tags?.map((tag) => {
            return (
              <button
                className="whitespace-nowrap border-2 border-black px-3 py-2 transition-all duration-300 hover:bg-black hover:text-white"
                key={tag}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Section4
