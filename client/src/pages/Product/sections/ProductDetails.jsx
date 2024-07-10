import { useContext, useEffect, useState } from 'react'
import { globalContext } from '../../../App'
import axiosInstance from '../../../utils/verifyJWT'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import { X } from 'lucide-react'
import axios from 'axios'

const ProductDetailsJSX = (props) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const { isLoggedIn, setCartItems } = useContext(globalContext)
  const { productDetails } = props
  const oldPrice = Number(productDetails?.price) * 1.2
  const [additionalImages, setAdditionalImages] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')

  useEffect(() => {
    const getAdditionalImages = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getAdditionalImages/${productDetails._id}`
        )
        const data = response.data
        setAdditionalImages(data)
      } catch (e) {
        console.error(e)
      }
    }
    getAdditionalImages()
  }, [])

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('You must log in before you can buy items')
      navigate('/login')
      return
    }

    if (productDetails.stock === 0) {
      alert('Sorry, we are out of stock')
      return
    }

    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item.productId === productDetails._id
      )
      if (itemExists) {
        alert('Item already exists in your cart')
        return prev
      } else {
        return [...prev, { productId: productDetails._id, quantity: 1 }]
      }
    })

    try {
      const response = await axiosInstance.post(
        `${serverURL}/api/updateCart?isNewItem=true`,
        { productId: productDetails._id, quantity: 1 }
      )
      if (response.status !== 200) {
        throw new Error('Failed to update cart')
      }
    } catch (e) {
      console.error(e)
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productDetails._id)
      )
      alert('Failed to update cart. Please try again.')
    }
  }

  const handleImageClick = (imageSrc) => {
    setCurrentImage(imageSrc)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <>
      <div className="relative flex flex-col justify-between">
        {additionalImages.length !== 0 ? (
          <Carousel
            autoPlay={true}
            showThumbs={false}
            showArrows={true}
            swipeable={true}
            showStatus={false}
            infiniteLoop={true}
            onClickItem={(_, item) => {
              handleImageClick(item.props.src)
            }}
          >
            <img
              src={`${serverURL}/products/${productDetails._id}.png`}
              alt="product image"
              loading="lazy"
            />
            {additionalImages.map((image) => (
              <img
                key={image}
                src={`${serverURL}/additionalImages/${image}`}
                alt="additional Image"
              />
            ))}
          </Carousel>
        ) : (
          <img
            src={`${serverURL}/products/${productDetails._id}.png`}
            alt="product image"
            loading="lazy"
            onClick={() =>
              handleImageClick(
                `${serverURL}/products/${productDetails._id}.png`
              )
            }
          />
        )}
        {modalIsOpen && (
          <div
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="relative flex items-center justify-center">
              <img
                src={currentImage}
                className="w-100% max-h-[800px] sm:max-w-[80%]"
                alt="Enlarged product"
              />
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 p-2 text-xl text-white lg:top-10"
              >
                <X className="size-5 stroke-white sm:size-10" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="col-start-2 col-end-3 space-y-4 bg-white">
        <h2 className="font-playfair text-5xl font-bold">
          {productDetails.name}
        </h2>
        <p className="text-lg font-semibold">$ {productDetails.price} USD </p>
        <div className="z-20 h-fit">
          <p
            className={`relative z-20 line-clamp-6 bg-white text-lg leading-8 text-gray-600`}
          >
            {productDetails.description}
          </p>
        </div>
        <div className="mt-10 flex items-center gap-5">
          <h4 className="font-playfair text-3xl">Delivery: </h4>
          <p className="relative top-[2px] text-xl">
            {productDetails.delivery}
          </p>
        </div>
        <div className="mt-10 flex items-center gap-5">
          <h4 className="font-playfair text-3xl">Stock: </h4>
          <p className="relative top-[2px] text-xl">
            {productDetails.stock < 1
              ? 'Out of Stock'
              : productDetails.stock <= 3
                ? `Only ${productDetails.stock} left`
                : 'In Stock'}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-10 w-[150px] border-2 border-black bg-white px-5 py-2"
        >
          ADD TO CART
        </button>
      </div>
    </>
  )
}

export default ProductDetailsJSX
