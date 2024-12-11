import React, { useEffect, useState, useContext } from 'react'
import CardItem from '../../../components/CardItem'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { globalContext } from '../../../App'

const Section2 = () => {
  const [cardsData, setCardsData] = useState([])
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(6)
  const [skip, setSkip] = useState(0) // Added skip state
  const [totalAvailable, setTotalAvailable] = useState(0)
  const categories = useContext(globalContext).exploreAll.categories || []
  const links = ['All', ...categories]
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getProducts?isCard=true&filter=${filter}&limit=${limit}&skip=${skip}`
        )
        if (skip === 0) {
          setCardsData(response.data) // Reset data if filtering from the start
        } else {
          setCardsData((prevData) => [...prevData, ...response.data]) // Append new data
        }
        setTotalAvailable(parseInt(response.headers['x-total-count']))
      } catch (e) {
        console.error(e)
        toast.error('Error Loading Data')
      }
    }
    fetchProducts()
  }, [filter, limit, skip]) // Add skip to dependencies array

  const handleFilter = (selectedFilter) => {
    if (selectedFilter !== filter) {
      setFilter(String(selectedFilter).toLowerCase())
      setLimit(6) // Reset limit when filter changes
      setSkip(0) // Reset skip when filter changes
    }
  }

  const handleShowMore = () => {
    setSkip((prevSkip) => prevSkip + limit) // Increment skip by current limit
  }

  return (
    <div className="relative mb-[150px]">
      <div className="flex flex-wrap items-center justify-center p-0 sm:p-10 md:justify-between">
        <div className="text-center md:text-start">
          <h2 className="mb-4 text-5xl font-semibold">Featured Collections</h2>
          <p>Most Selling And Trending Products</p>
        </div>
        <ul className="flex w-full flex-wrap justify-center gap-5 md:justify-end">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => handleFilter(link)}
              className={`transform border-b-4 border-transparent capitalize transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-black hover:font-bold ${filter === link ? 'border-black font-bold' : ''}`}
            >
              {link}
            </button>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-end justify-center gap-10">
        {cardsData.map((data) => (
          <CardItem key={data._id} data={data} display={true} />
        ))}
      </div>
      {skip + limit < totalAvailable && (
        <button
          className="absolute left-1/2 mt-10 -translate-x-1/2 bg-green-300 px-6 py-4 text-slate-600 transition-all duration-300 hover:bg-green-500 hover:font-bold hover:text-white"
          onClick={handleShowMore}
        >
          Show More
        </button>
      )}
      <ToastContainer />
    </div>
  )
}

export default Section2
