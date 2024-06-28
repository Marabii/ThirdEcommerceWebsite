import { LoaderCircle } from 'lucide-react'
import CardItemId from '../../../../components/CardItemId'
import axios from 'axios'
import { useEffect, useState } from 'react'

const SearchHandler = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  const [searchLoaded, setSearchLoaded] = useState(false)
  const [loaded, setLoaded] = useState(false)
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

  useEffect(() => {
    console.log(results)
  }, [results])

  return (
    <div>
      <label>Search For Product</label>
      <input type="text" value={query} onChange={handleQueryChange} />
      {query.length > 0 && (
        <div>
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
            results.map((result) => (
              <div>
                <img
                  src={`${serverURL}/products/${result.objectID}.png`}
                  alt="search product"
                />
                <p>{result.name}</p>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchHandler
