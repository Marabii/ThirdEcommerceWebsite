import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/verifyJWT'
import Header from '../../components/Header'
import TopSection from '../../components/TopSection'
import Comments from './sections/Comments'
import CardItem from '../../components/CardItem'

const CheckOrders = () => {
  const [orderData, setOrderData] = useState(null)
  const [productsData, setProductsData] = useState([])
  const [isErrorAlertShown, setIsErrorAlertShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const orderConfirmationNumber = useParams().id
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverURL}/api/getOrder/${orderConfirmationNumber}`
        )
        setOrderData(response.data)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
      }
    }

    fetchOrderData()
  }, [orderConfirmationNumber, serverURL, axiosInstance])

  useEffect(() => {
    if (orderData) {
      const fetchProductsData = async () => {
        const productsPromises = orderData.cart.map((cartItem) =>
          axiosInstance
            .get(`${serverURL}/api/getProduct/${cartItem.productId}`)
            .catch((e) => ({
              error: true,
              productId: cartItem.productId,
              message: e.message
            }))
        )

        const results = await Promise.allSettled(productsPromises)
        const loadedProducts = []
        results.forEach((result) => {
          if (result.status === 'fulfilled' && !result.value.error) {
            loadedProducts.push(result.value.data)
          } else if (
            (result.status === 'rejected' || result.value.error) &&
            !isErrorAlertShown
          ) {
            console.error(
              `Error loading product ${result.value.productId}: ${result.value.message}`
            )
            if (!isErrorAlertShown) {
              alert(
                'One of the products you bought is no longer featured on the website.'
              )
              setIsErrorAlertShown(true) // Prevent further alerts
            }
          }
        })
        setProductsData(loadedProducts)
      }

      fetchProductsData()
    }
  }, [orderData, serverURL, axiosInstance, isErrorAlertShown])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!orderData) {
    return <div>Order not found.</div>
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
            {productsData.map((productData) => (
              <CardItem
                key={productData._id}
                data={productData}
                display={false}
                width={250}
              />
            ))}
          </div>
          <div className="mb-20 w-full">
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
              <p className="mb-2 mt-5 text-xl font-semibold">
                Number Of Products
              </p>
              <p>{orderData.cart.length}</p>
              <p className="mb-2 mt-5 text-xl font-semibold">Total Amount:</p>
              <p>${orderData.totalAmount.toFixed(2)}</p>
              <p className="mb-2 mt-5 text-xl font-semibold">Payment Date:</p>
              <p>{new Date(orderData.createdAt).toISOString().split('T')[0]}</p>
              <h2 className="mb-2 mt-5 text-xl font-semibold">
                Shipping Address
              </h2>
              <p>{orderData.shippingAddress.street}</p>
              <p>
                {orderData.shippingAddress.city},{' '}
                {orderData.shippingAddress.zip}
              </p>
            </div>
            <Comments productsData={productsData} orderData={orderData} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckOrders
