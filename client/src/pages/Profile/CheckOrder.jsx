import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/verifyJWT'
import Header from '../../components/Header'
import TopSection from '../../components/TopSection'
import CardItemId from '../../components/CardItemId'
import { useNavigate } from 'react-router-dom'

const CheckOrders = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState()
  const orderConfirmationNumber = useParams().id
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [loaded, setLoaded] = useState(true)

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverURL}/api/getOrder/${orderConfirmationNumber}`
        )
        setOrderData(response.data)
      } catch (e) {
        console.error(e)
      }
    }
    getOrderData()
  }, [orderConfirmationNumber])

  if (!orderData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <TopSection
        data={{
          title: 'Your Order Details',
          description: 'You can check your order details on this page.'
        }}
      />
      <main className="w-full">
        <div className="mb-20 w-full">
          <h2 className="my-5 w-full bg-slate-100 p-5 text-center text-3xl font-semibold">
            Your Order
          </h2>
          <div className="flex w-full flex-wrap justify-center gap-5">
            {orderData.cart.map((cartItem) => {
              return (
                <CardItemId
                  key={cartItem.productId}
                  productId={cartItem.productId}
                  display={false}
                  width={250}
                  setLoaded={setLoaded}
                  loading={loaded}
                />
              )
            })}
          </div>
          <h2 className="my-5 w-full bg-slate-100 p-5 text-center text-3xl font-semibold">
            Order Summary
          </h2>
          <div className="space-y-2 rounded-lg bg-white p-4 shadow-xl">
            <p className="mb-2 mt-5 text-xl font-semibold">
              Order Confirmation Number:
            </p>
            <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              {orderData.orderConfirmationNumber}
            </p>

            <p className="mb-2 mt-5 text-xl font-semibold">Order Status:</p>
            <p>{orderData.paymentDetails.status}</p>
            <p className="mb-2 mt-5 text-xl font-semibold">Total Amount:</p>
            <p>${orderData.totalAmount.toFixed(2)}</p>
            <p className="mb-2 mt-5 text-xl font-semibold">Payment Date:</p>
            <p>{new Date(orderData.createdAt).toLocaleDateString()}</p>
            <h2 className="mb-2 mt-5 text-xl font-semibold">
              Shipping Address
            </h2>
            <p>{orderData.shippingAddress.street}</p>
            <p>
              {orderData.shippingAddress.city}, {orderData.shippingAddress.zip}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckOrders
