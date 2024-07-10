import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/verifyJWT'
import SelectStatus from './SelectStatus/SelectStatus'
import { useNavigate } from 'react-router-dom'

const CheckOrders = () => {
  const navigate = useNavigate()
  const [ordersData, setOrdersData] = useState()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverURL}/api/getOrdersData`
        )
        const data = response.data
        setOrdersData(data)
      } catch (e) {
        console.error(e)
      }
    }
    getOrdersData()
  }, [])

  function formatDate(inputDate) {
    const date = new Date(inputDate)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().substring(2)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return (
      <div>
        <p className="text-md font-semibold text-slate-500">{`${day}/${month}/${year}`}</p>
        <p className="text-sm font-semibold text-gray-400">{`${hours}:${minutes}`}</p>
      </div>
    )
  }

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Order number copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  }

  if (!ordersData) {
    return <div>Loading ....</div>
  }

  if (ordersData.length === 0) {
    return (
      <div className="space-y-5 text-center">
        <h2 className="text-xl font-bold text-slate-700">No Orders Found</h2>
        <button
          className="rounded-lg border-2 border-slate-500 px-4 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-500 hover:text-white"
          onClick={() => navigate('/shop')}
        >
          Checkout Our Store
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-700">Recent Orders</h2>
        <SelectStatus />
      </div>
      <table className="w-full text-left font-jost">
        <tbody>
          <tr className="h-[50px] w-full border-b border-t">
            <th>Order Date</th>
            <th>Order Confirmation Number</th>
            <th>Price</th>
            <th>Status</th>
            <th>Check Order</th>
          </tr>
          {ordersData.map((order) => (
            <tr
              key={order.paymentDetails.transactionId}
              className="h-[100px] border-b border-t"
            >
              <td>{formatDate(order.createdAt)}</td>
              <td className="pr-16">
                <div className="flex items-center justify-between ">
                  <div className="text-gray-400">
                    {order.orderConfirmationNumber.substring(0, 30)}...
                  </div>
                  <button
                    className="rounded-lg border-2 border-slate-500 px-4 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-500 hover:text-white"
                    onClick={() =>
                      copyToClipboard(order.orderConfirmationNumber)
                    }
                  >
                    Copy
                  </button>
                </div>
              </td>
              <td className="font-bold text-slate-700">${order.totalAmount}</td>
              <td className="font-bold text-slate-700">{order.status}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/check-order/${order.orderConfirmationNumber}`)
                  }
                  className="rounded bg-slate-500 px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:bg-slate-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Check Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CheckOrders
