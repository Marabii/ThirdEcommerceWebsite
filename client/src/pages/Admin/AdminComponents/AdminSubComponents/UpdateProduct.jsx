import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import axiosInstance from '../../../../utils/verifyJWT'
import { globalContext } from '../../../../App'

import DropzoneHandler from './DropzoneHandler'
import MaterialHandler from './MaterialHandler'
import TagHandler from './TagHandler'
import SpecificationHandler from './SpecificationsHandler'
import SearchHandler from './SearchHandler'

const UpdateProduct = () => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [currentProduct, setCurrentProduct] = useState('')
  const [productDetailsForm, setProductDetailsForm] = useState({
    name: '',
    price: '',
    description: '',
    delivery: '',
    stock: '',
    category: '',
    productDetails: '',
    specification: {},
    materials: [''],
    tags: ['']
  })

  //----Get Categories----
  const categories = useContext(globalContext).exploreAll.categories
  //----End Of Get Categories----

  //----Getting Product Data----
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getProduct/${currentProduct}`
        )
        const data = response.data
        setProductDetailsForm(data)
      } catch (e) {
        console.log(e)
      }
    }

    const getImgs = async () => {
      try {
        setThumbnail([
          {
            preview: `${serverURL}/products/${currentProduct}.png`,
            name: `${currentProduct}.png`
          }
        ])
        const additionalImages = await axios.get(
          `${serverURL}/api/getAdditionalImages/${currentProduct}`
        )

        setImages(
          additionalImages.data.map((imgName) => {
            return {
              preview: `${serverURL}/additionalImages/${imgName}`,
              name: imgName
            }
          })
        )
      } catch (e) {
        console.error(e)
      }
    }

    if (currentProduct !== '') {
      getProductDetails()
      getImgs()
    }
  }, [currentProduct])
  //----End Of Getting Product Data----

  //----Handle dropzone----
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState([])
  const [hasThumbnailChanged, setHasThumbnailChanged] = useState(false)
  const [haveImagesChanged, setHaveImagesChanged] = useState(false)
  //----finish handle dropzone----

  const handleProductDetailsFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      if (value.length > 30) {
        alert('Product name should not exceed 30 characters')
        return
      }
    }

    if (name === 'description' && value.length > 360) {
      alert('Description should not exceed 360 characters')
      return
    }

    setProductDetailsForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const resetProductDetailsForm = () => {
    if (window.confirm('Are you sure you want to discard these changes ?')) {
      setProductDetailsForm({
        name: '',
        price: '',
        description: '',
        delivery: '',
        stock: '',
        category: '',
        productDetails: '',
        specification: {},
        materials: [''],
        tags: ['']
      })

      setImages([])
      setThumbnail([])
      setCurrentProduct('')
    }
  }

  const handleUploadThumbnail = async () => {
    const formData = new FormData()
    formData.append('thumbnail', thumbnail[0])
    try {
      await axiosInstance.post(
        `${serverURL}/api/updateThumbnail/${currentProduct}`,
        formData
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleAdditionalImages = async () => {
    const formData = new FormData()
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_REACT_APP_SERVER}/api/addAdditionalImages/${currentProduct}`,
        formData
      )
    } catch (error) {
      alert('Failed to upload images')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (hasThumbnailChanged) await handleUploadThumbnail()
      if (haveImagesChanged) await handleAdditionalImages()

      const response = await axiosInstance.post(
        `${serverURL}/api/updateProduct/${currentProduct}`,
        productDetailsForm
      )

      console.log('Product updated successfully:', response.data)

      // Reset the form
      setProductDetailsForm({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        delivery: '',
        productDetails: '',
        specification: {},
        materials: [],
        tags: []
      })
      setImages([])
      setThumbnail([])
      setCurrentProduct('')

      // Show success message
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product. Please try again.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-[580px] space-y-4 rounded-xl bg-white p-4"
    >
      <h1 className="mb-5 text-2xl font-bold">Update Product</h1>
      {currentProduct === '' ? (
        <div className="relative w-full">
          <SearchHandler
            setCurrentProduct={setCurrentProduct}
            placeholder={'Enter the name of the product you want to modify'}
          />
        </div>
      ) : (
        <>
          <label className="mb-2 block text-lg font-semibold" htmlFor="name">
            Product name
          </label>
          <input
            className="w-full rounded-lg border border-slate-500 px-4 py-5"
            type="text"
            name="name"
            id="name"
            placeholder="Enter Product name"
            value={productDetailsForm.name}
            onChange={handleProductDetailsFormChange}
            required
          />
          <p className="mt-2 text-sm text-gray-600">
            Do not exceed 20 characters when entering the product name.
          </p>
          <div className="my-2 flex justify-between">
            <div>
              <label
                className="mb-2 block text-lg font-semibold"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="w-full rounded-lg border border-slate-500 px-2 py-3 text-lg"
                type="number"
                name="price"
                id="price"
                placeholder="Enter Price"
                onChange={handleProductDetailsFormChange}
                value={productDetailsForm.price}
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-lg font-semibold"
                htmlFor="stock"
              >
                Stock
              </label>
              <input
                min={1}
                className="w-full rounded-lg border border-slate-500 px-2 py-3 text-lg"
                type="number"
                name="stock"
                id="stock"
                placeholder="Enter Stock"
                onChange={handleProductDetailsFormChange}
                value={productDetailsForm.stock}
                required
              />
            </div>
          </div>
          <div>
            <label
              className="mb-2 block text-lg font-semibold"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Enter Description"
              value={productDetailsForm.description}
              onChange={handleProductDetailsFormChange}
              className="min-h-[200px] w-full resize-none overflow-hidden rounded-lg border border-gray-500 p-3"
              required
            />
          </div>
          <div>
            <label
              htmlFor="productDetails"
              className="mb-2 block text-lg font-semibold"
            >
              Product Details
            </label>
            <textarea
              name="productDetails"
              id="productDetails"
              placeholder="Enter Product Details"
              onChange={handleProductDetailsFormChange}
              value={productDetailsForm.productDetails}
              className="min-h-[150px] w-full resize-none overflow-hidden rounded-lg border border-gray-500 p-3"
            />
          </div>
          <div>
            <label
              className="mb-2 block text-lg font-semibold"
              htmlFor="delivery"
            >
              Delivery
            </label>
            <textarea
              name="delivery"
              id="delivery"
              placeholder="Enter Delivery"
              value={productDetailsForm.delivery}
              onChange={handleProductDetailsFormChange}
              className="min-h-[100px] w-full resize-none overflow-hidden rounded-lg border border-gray-500 p-3"
              required
            />
          </div>
          <div>
            <div>
              <label
                className="mb-2 block text-lg font-semibold"
                htmlFor="category"
              >
                Category
              </label>
              <select
                required
                name="category"
                id="category"
                value={productDetailsForm.category}
                onChange={handleProductDetailsFormChange}
                className="w-full rounded-md border border-gray-500 p-2 text-lg"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <SpecificationHandler
              productDetailsForm={productDetailsForm}
              setProductDetailsForm={setProductDetailsForm}
            />
            <div className="flex flex-wrap justify-between">
              <MaterialHandler
                productDetailsForm={productDetailsForm}
                setProductDetailsForm={setProductDetailsForm}
              />
              <TagHandler
                productDetailsForm={productDetailsForm}
                setProductDetailsForm={setProductDetailsForm}
              />
            </div>
            <DropzoneHandler
              images={images}
              setImages={setImages}
              setThumbnail={setThumbnail}
              thumbnail={thumbnail}
              setHasThumbnailChanged={setHasThumbnailChanged}
              setHaveImagesChanged={setHaveImagesChanged}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="h-24 w-full rounded-md border border-black transition-all duration-300 hover:bg-slate-800 hover:text-white"
          >
            Update Product
          </button>
          <button
            onClick={resetProductDetailsForm}
            className="rounded-md bg-red-500 p-2 text-white"
          >
            Update Another Product
          </button>
        </>
      )}
    </form>
  )
}

export default UpdateProduct
