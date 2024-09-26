import { useState } from 'react'
import SearchHandler from './SearchHandler'
import CardItemId from '../../../../components/CardItemId'
import axiosInstance from '../../../../utils/verifyJWT'
import { ChevronDown } from 'lucide-react'

const SetPromo = () => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [option, setOption] = useState('specific')
  const [loaded, setLoaded] = useState(true)
  const [itemsWithDiscount, setItemsWithDiscount] = useState([])
  const [discountForAll, setDiscountForAll] = useState(0)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  const handleOptionChange = (value) => {
    setOption(value)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleDiscountSpecific = (e) => {
    setItemsWithDiscount((prev) => {
      const obj = { product: e.target.id, discount: e.target.value }
      const prodIndex = prev.findIndex((item) => item.product === obj.product)

      if (prodIndex === -1) {
        return [...prev, obj]
      } else {
        prev[prodIndex].discount = obj.discount
        return [...prev]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(`${serverURL}/api/setPromo`, {
        option: option,
        itemsWithDiscount: itemsWithDiscount,
        discountForAll: discountForAll
      })
      alert('Discount set successfully')
      //---reset form---
      setSelectedProducts([])
      setItemsWithDiscount([])
      setDiscountForAll(0)
      setOption('specific')
      //---end reset form---
    } catch (error) {
      console.error('Failed to fetch:', error)
      alert('Failed to set promo. Please try again.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-[580px] space-y-4 rounded-xl bg-white p-4"
    >
      <h1 className="mb-5 text-2xl font-bold">Set Promo</h1>
      <div className="relative inline-block w-64">
        <div
          className="flex cursor-pointer items-center justify-between border border-gray-300 p-2"
          onClick={toggleDropdown}
        >
          <span>
            {option === 'specific' ? 'Specific Product' : 'All Products'}
          </span>
          <ChevronDown
            className={`ml-2 transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full border border-gray-300 bg-white shadow-lg">
            <div
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleOptionChange('specific')}
            >
              Specific Product
            </div>
            <div
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleOptionChange('all')}
            >
              All Products
            </div>
          </div>
        )}
      </div>

      {option === 'specific' && (
        <>
          <div className="relative w-full">
            <SearchHandler
              setCurrentProduct={(value) => {
                setSelectedProducts([...selectedProducts, value])
              }}
              placeholder={
                'Enter the name of the product you want to make it have a discount'
              }
            />
          </div>
          {selectedProducts.length > 0 && (
            <div className="border border-black p-5">
              <h2 className="relative -top-[32px] mb-2 w-fit bg-white font-jost capitalize">
                Selected Products
              </h2>

              {selectedProducts.map((product) => (
                <div className="flex items-center justify-between gap-2 py-3">
                  <CardItemId
                    key={product}
                    productId={product}
                    display={false}
                    width={250}
                    setLoaded={setLoaded}
                    loading={loaded}
                  />
                  <input
                    className="w-1/3 rounded-lg border border-slate-500 px-2 py-3 text-lg"
                    type="number"
                    min="0"
                    max="100"
                    name="discount"
                    id={String(product)}
                    required
                    placeholder="Enter discount"
                    onChange={handleDiscountSpecific}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {option === 'all' && (
        <div>
          <h2 className="mb-2 font-jost capitalize">
            all products will have the same discount:{' '}
          </h2>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-500 px-2 py-3 text-lg"
            min="0"
            max="100"
            name="discount"
            id="all"
            required
            placeholder="Enter discount"
            onChange={(e) => setDiscountForAll(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        className="h-24 w-full rounded-md border border-black transition-all duration-300 hover:bg-slate-800 hover:text-white"
      >
        Submit
      </button>
    </form>
  )
}

export default SetPromo
