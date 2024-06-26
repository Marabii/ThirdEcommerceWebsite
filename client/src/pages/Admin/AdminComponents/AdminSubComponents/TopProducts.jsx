import { useEffect, useState } from 'react'
import axiosInstance from '../../../../utils/verifyJWT'
import { LoaderCircle } from 'lucide-react'

const TopProducts = () => {
  const [topProductsIds, setTopProductsIds] = useState([])
  const [topProductsData, setTopProductsData] = useState([])
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getTopProductsIds = async () => {
      try {
        const response = await axiosInstance.get(
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
          axiosInstance
            .get(`${serverURL}/api/getProduct/${productId}`)
            .catch((e) => ({
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
    <div className="scrollbar-hide h-[400px] w-[500px] overflow-y-scroll rounded-xl bg-white p-5 shadow-lg">
      <h2 className="mb-5 text-2xl font-bold">Top Products</h2>
      <div className="space-y-3">
        {topProductsData.map((product) => (
          <div key={product._id} className="flex gap-2">
            <img
              src={`${serverURL}/products/${product._id}.png`}
              alt={product.name}
              className="aspect-square w-[40px]"
            />
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-500">{product.stock} items left</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopProducts
