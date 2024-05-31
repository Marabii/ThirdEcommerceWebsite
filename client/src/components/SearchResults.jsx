import axios from 'axios'
import CardItem from './CardItem'
import { useEffect, useState, useRef } from 'react'
import { X, LoaderCircle } from 'lucide-react'

const SearchResults = ({ hits, setQuery }) => {
  const [searchData, setSearchData] = useState()
  const [loading, setLoading] = useState(true)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const ref = useRef()

  // Fetch detailed product data
  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const promises = hits.map((hit) =>
        axios.get(`${serverURL}/api/getProduct/${hit.objectID}`)
      )
      const data = await Promise.all(promises)
      setSearchData(data.map((item) => item.data))
      setTimeout(() => setLoading(false), 2000) // Delay setting loading to false
    }
    if (hits.length > 0) {
      getData()
    } else {
      setSearchData([])
      setTimeout(() => setLoading(false), 5000)
    }
  }, [hits])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setQuery])

  if (!searchData) {
    return <div>Loading ...</div>
  }

  return (
    <div
      ref={ref}
      className="absolute left-10 right-10 top-[120px] z-20 h-[500px] overflow-y-scroll rounded-md border-2 border-black bg-white p-10 shadow-2xl"
    >
      <X
        className="absolute right-5 top-5 cursor-pointer"
        onClick={() => setQuery('')}
      />
      <h2 className="mb-10 text-2xl font-bold text-slate-600">
        Search Results
      </h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <div
            className="inline-block animate-spin rounded-full border-4"
            role="status"
          >
            <LoaderCircle strokeWidth={0.5} size={100} />
          </div>
        </div>
      ) : searchData.length !== 0 ? (
        <div className="flex flex-wrap items-center justify-around overflow-y-auto">
          {searchData.map((data) => (
            <CardItem key={data.id} data={data} display={false} width={250} />
          ))}
        </div>
      ) : (
        <div>No results are found</div>
      )}
    </div>
  )
}

export default SearchResults
