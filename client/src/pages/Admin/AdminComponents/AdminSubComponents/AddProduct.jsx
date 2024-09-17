import { useState, useContext } from 'react'
import { globalContext } from '../../../../App'

import DropzoneHandler from './DropzoneHandler'
import MaterialHandler from './MaterialHandler'
import TagHandler from './TagHandler'
import SpecificationHandler from './SpecificationsHandler'
import UploadData from './UploadData'

const AddProduct = () => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
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

  //----Handle dropzone----
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState([])
  //----finish handle dropzone----

  const { handleSubmit } = UploadData({
    productDetailsForm,
    setProductDetailsForm,
    thumbnail,
    setThumbnail,
    images,
    setImages
  })

  const handleProductDetailsFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      if (value.length > 20) {
        alert('Product name should not exceed 20 characters')
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

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-[580px] space-y-4 rounded-xl bg-white p-4"
    >
      <h1 className="mb-5 text-2xl font-bold">Add Product</h1>
      <div>
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
      </div>
      <div className="my-2 flex justify-between">
        <div>
          <label className="mb-2 block text-lg font-semibold" htmlFor="price">
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
          <label className="mb-2 block text-lg font-semibold" htmlFor="stock">
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
        <label className="mb-2 block text-lg font-semibold" htmlFor="delivery">
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
          {categories ? (
            <select
              required
              name="category"
              id="category"
              value={productDetailsForm.category}
              onChange={handleProductDetailsFormChange}
              className="w-full rounded-md border border-gray-500 p-2 text-lg"
            >
              {categories.map((category) => {
                return (
                  <option
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </option>
                )
              })}
            </select>
          ) : (
            <div className="w-full animate-pulse rounded-md border border-gray-500 p-2 text-lg"></div>
          )}
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
        />
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="h-24 w-full rounded-md border border-black transition-all duration-300 hover:bg-slate-800 hover:text-white"
      >
        Add Product
      </button>
    </form>
  )
}

export default AddProduct
