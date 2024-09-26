import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import { useEffect, useState } from 'react'

const SearchHandler = ({ setCurrentProduct, placeholder }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  const [searchLoaded, setSearchLoaded] = useState(false)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  const handleQueryChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (timeoutId) clearTimeout(timeoutId)
    const newTimeoutId = setTimeout(() => {
      handleSearch(value)
    }, 400)

    setTimeoutId(newTimeoutId)
  }

  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `${serverURL}/api/search?query=${encodeURIComponent(searchValue)}`
      )
      const data = response.data
      setResults(data.hits)
      setSearchLoaded(true)
    } catch (error) {
      console.error('Failed to fetch:', error)
      setSearchLoaded(false)
    }
  }

  return (
    <div>
      <label className="mb-2 block text-lg font-semibold">
        Search For Product
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleQueryChange}
        className="w-full rounded-lg border border-slate-500 px-4 py-5"
      />
      {query.length > 0 && (
        <div className="mt-2 max-h-[1900px] w-full">
          {!searchLoaded ? (
            <div className="flex items-center justify-center">
              <div
                className="inline-block animate-spin rounded-full border-4"
                role="status"
              >
                <LoaderCircle strokeWidth={0.5} size={100} />
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="relative flex flex-col gap-2 overflow-y-scroll">
              {results.map((result) => (
                <button
                  onClick={() => {
                    setCurrentProduct(result.objectID)
                    setQuery('')
                  }}
                  className="flex items-center justify-between rounded-md bg-slate-200 p-2 transition-all duration-300 hover:bg-slate-300"
                >
                  <img
                    className="size-16"
                    src={`${serverURL}/products/${result.objectID}.png`}
                    alt="search product"
                  />
                  <p>{result.name}</p>
                </button>
              ))}
            </div>
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchHandler
