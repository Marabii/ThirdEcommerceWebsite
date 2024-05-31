import axios from 'axios'
import CardItem from './CardItem'
import { useEffect, useState } from 'react'

const SearchResults = (props) => {
  const { hits } = props
  const [searchData, setSearchData] = useState()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getData = async () => {
      const promises = hits.map((hit) => {
        return axios.get(`${serverURL}/api/getProduct/${hit.objectID}`)
      })

      const data = await Promise.all(promises)
      setSearchData(data.map((item) => item.data))
    }
    if (hits) getData()
  }, [hits])

  if (!searchData) {
    return <div>Loading ...</div>
  }

  return (
    <div className="absolute left-10 right-10 top-[100px] z-20 rounded-md border-2 border-black bg-white p-10 shadow-2xl">
      <h2 className="mb-10 text-2xl font-bold text-slate-600">
        Search Results
      </h2>
      {searchData.length !== 0 ? (
        <div className=" flex flex-wrap items-center justify-around">
          {searchData.map((data) => {
            return <CardItem data={data} display={false} width={180} />
          })}
        </div>
      ) : (
        <div>No results are found</div>
      )}
    </div>
  )
}

export default SearchResults
