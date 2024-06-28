import CardItemId from './CardItemId'
import { useEffect, useState, useRef } from 'react'
import { X, LoaderCircle } from 'lucide-react'

const SearchResults = ({ hits, setQuery, searchLoaded }) => {
  const [loaded, setLoaded] = useState(true)
  const ref = useRef()

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
  }, [])

  const closeSearch = () => {
    setQuery('')
  }

  return (
    <div
      ref={ref}
      className="absolute left-10 right-10 top-[120px] z-20 h-[500px] overflow-y-scroll rounded-md border-2 border-black bg-white p-10 shadow-2xl"
    >
      <X
        className="absolute right-5 top-5 cursor-pointer"
        onClick={closeSearch}
      />
      <h2 className="mb-10 text-2xl font-bold text-slate-600">
        Search Results
      </h2>
      {hits.length === 0 && searchLoaded && <div>No results are found</div>}
      {!searchLoaded ? (
        <div className="flex items-center justify-center">
          <div
            className="inline-block animate-spin rounded-full border-4"
            role="status"
          >
            <LoaderCircle strokeWidth={0.5} size={100} />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-around overflow-y-auto">
          {hits.map((hit) => (
            <CardItemId
              key={hit.objectID}
              productId={hit.objectID}
              display={false}
              width={250}
              setLoaded={setLoaded}
              loading={loaded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults
