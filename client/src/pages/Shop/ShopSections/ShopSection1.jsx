import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import CardItem from '../../../components/CardItem'
import SortByDropdown from './SortByDropdown'
import FilterDropdown from './FilterByDorpdown'
import FilterByMaterials from './FilterByMaterials'
import { toast, ToastContainer } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { globalContext } from '../../../App'

const ShopSection1 = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cardsData, setCardsData] = useState([])
  const [skip, setSkip] = useState(0)
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [exploreAll, setExploreAll] = useState({})
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const categories = useContext(globalContext).exploreAll.categories || []
  const filters = ['All', ...categories]
  const limit = 6

  // Read and set filter and sortOrder from URL
  const filter = searchParams.get('filter') || 'all'
  const sortOrder = searchParams.get('sort') || 'price-desc'
  const material = searchParams.get('material') || 'all'

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${serverURL}/api/getProducts`, {
          params: {
            isCard: true,
            filter,
            limit,
            skip,
            sort: sortOrder,
            material: material
          }
        })
        if (skip === 0) {
          setCardsData(response.data)
        } else {
          setCardsData((prev) => [...prev, ...response.data])
        }
        setTotalAvailable(parseInt(response.headers['x-total-count']))
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Error Loading Data')
      }
    }
    fetchProducts()
  }, [filter, limit, skip, sortOrder, material])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/exploreAll`)
        const data = response.data
        setExploreAll(data)
      } catch (e) {
        console.error(e)
        alert('Error Loading Data')
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <div className="mx-5 my-10 flex justify-between">
        <div className="flex gap-5">
          <FilterDropdown filters={filters} />
          <SortByDropdown />
          {exploreAll?.materials && (
            <FilterByMaterials materials={exploreAll?.materials} />
          )}
        </div>
      </div>
      <div className="grid">
        <div className="flex flex-wrap items-end justify-center gap-10">
          {cardsData.map((data) => (
            <CardItem key={data._id} data={data} display={true} />
          ))}
        </div>
        {skip + limit < totalAvailable && (
          <button
            className="my-10 justify-self-center bg-green-300 px-6 py-4 text-slate-600 transition-all duration-300 hover:bg-green-500 hover:font-bold hover:text-white"
            onClick={() => setSkip((prev) => prev + limit)}
          >
            Show More
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ShopSection1
