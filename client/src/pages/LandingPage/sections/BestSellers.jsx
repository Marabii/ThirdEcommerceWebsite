import { useEffect, useState } from 'react'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import CardItem from '../../../components/CardItem'

const BestSellers = () => {
  const [topProductsIds, setTopProductsIds] = useState([])
  const [topProductsData, setTopProductsData] = useState([])
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getTopProductsIds = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/most-purchased-products`
        )
        setTopProductsIds(response.data)
      } catch (e) {
        console.error(e)
        alert('Unable to get top products Ids')
      }
    }
    getTopProductsIds()
  }, [])

  useEffect(() => {
    const getTopProductsData = async () => {
      if (topProductsIds.length !== 0) {
        const productsDataPromises = topProductsIds.map((productId) =>
          axios.get(`${serverURL}/api/getProduct/${productId}`).catch((e) => ({
            error: true,
            productId,
            message: e.message
          }))
        )

        const results = await Promise.allSettled(productsDataPromises)
        const loadedProducts = results.reduce((acc, result) => {
          if (result.status === 'fulfilled' && !result.value.error) {
            acc.push(result.value.data)
          } else {
            console.error(
              `Error loading product ${result.value.productId}: ${result.value.message}`
            )
          }
          return acc
        }, [])

        setTopProductsData(loadedProducts)
      }
    }
    getTopProductsData()
  }, [topProductsIds])

  if (topProductsData.length === 0 && topProductsIds.length !== 0) {
    return (
      <div>
        <LoaderCircle className="animate-spin" size={70} />
      </div>
    )
  }

  return (
    <div className="mt-24 space-y-5 p-2 md:px-10 2xl:px-24">
      <h2 className="font-playfair text-4xl font-bold">Best Sellers</h2>
      <p className="font-jost text-gray-600">Most Selling Product</p>
      <div className="flex flex-wrap gap-5">
        {topProductsData.map((product) => (
          <CardItem key={product._id} data={product} display={true} />
        ))}
      </div>
    </div>
  )
}

export default BestSellers
