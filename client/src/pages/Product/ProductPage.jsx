import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import axios from 'axios'
import ProductDetailsJSX from './sections/ProductDetails'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'
import Section4 from './sections/Section4'
import ReviewsComponent from './sections/ReviewsComponent'
import TopSection from '../../components/TopSection'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'

const topSectionData = {
  title: 'Product Details',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
}

const ProductPage = () => {
  const { id } = useParams()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [productDetails, setProductDetails] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/getProduct/${id}`)
        const data = res.data
        setProductDetails(data)
      } catch (e) {
        console.error(e)
        alert('Error Loading Data')
        navigate('/')
      }
    }
    fetchProductDetails()
  }, [])

  if (!productDetails) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <TopSection data={topSectionData} />
      <div className="w-full gap-5 space-y-4 px-5 py-14 xl:grid xl:grid-cols-2 2xl:grid-cols-3 2xl:grid-rows-[500px_minmax(900px,_1fr)_100px]">
        <ProductDetailsJSX productDetails={productDetails} />
        <div className="md:col-start-1 md:col-end-2 lg:col-end-3">
          <Section2 productDetails={productDetails} />
          <ReviewsComponent productDetails={productDetails} />
          <Section3 productDetails={productDetails} />
        </div>
        <Section4 id={id} />
      </div>
      <Footer />
    </>
  )
}

export default ProductPage
