import CardItemId from './CardItemId'
import { useEffect, useState, useRef } from 'react'
import { X, LoaderCircle } from 'lucide-react'

const SearchResults = ({ hits, setQuery, searchLoaded }) => {
  const [loaded, setLoaded] = useState(true)
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth > 1280) {
        if (ref.current && !ref.current.contains(event.target)) {
          setQuery('')
        }
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
      className="relative z-20 mx-auto w-full max-w-3xl rounded-md border-2 border-black bg-white p-10 shadow-2xl xl:absolute xl:left-1/2 xl:mt-20 xl:max-w-[90%] xl:-translate-x-1/2"
    >
      <div className="relative mb-4">
        <X
          size={30}
          className="absolute right-0 top-0 cursor-pointer"
          onClick={closeSearch}
        />
        <h2 className="text-2xl font-bold text-slate-600">Search Results</h2>
      </div>
      {searchLoaded ? (
        hits.length === 0 ? (
          <div>No results found</div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            <div className="flex flex-wrap items-center justify-around pb-10">
              {hits.map((hit) => (
                <CardItemId
                  key={hit.objectID}
                  productId={hit._id.$oid}
                  display={false}
                  width={250}
                  setLoaded={setLoaded}
                  loading={loaded}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center">
          <LoaderCircle size={100} strokeWidth={0.5} />
        </div>
      )}
    </div>
  )
}

export default SearchResults
