import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, X } from 'lucide-react'
import axiosInstance from '../../../../utils/verifyJWT'

const AddProduct = () => {
  const [productDetailsForm, setProductDetailsForm] = useState({
    name: '',
    price: '',
    description: '',
    delivery: '',
    stock: '',
    category: 'sofa',
    productDetails: '',
    specification: {},
    materials: [''],
    tags: ['']
  })

  const [tempKey, setTempKey] = useState('')
  const [tempValue, setTempValue] = useState('')
  const [productId, setProductId] = useState('')

  //----Handle dropzone----
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 3) {
      alert('You can only upload up to 3 images')
      setImages([])
    } else {
      setImages(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  }, [])

  const useDropZoneImages = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true
  })

  const getRootPropsImages = useDropZoneImages.getRootProps
  const getInputPropsImages = useDropZoneImages.getInputProps

  const useDropZoneThumbnail = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles) => {
      setThumbnail(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  })

  const getRootPropsThumbnail = useDropZoneThumbnail.getRootProps
  const getInputPropsThumbnail = useDropZoneThumbnail.getInputProps

  useEffect(() => {
    setTimeout(() => {
      images.forEach((file) => URL.revokeObjectURL(file.preview))
    }, 1000)
  }, [images])

  const thumbsForImages = images.map((file) => (
    <div key={file.name} className="my-10 max-w-[120px]">
      <div>
        <img src={file.preview} />
      </div>
    </div>
  ))

  const thumbsForThumbnail = thumbnail.map((file) => (
    <div key={file.name} className="my-10 max-w-[120px]">
      <div>
        <img src={file.preview} />
      </div>
    </div>
  ))

  //----finish handle dropzone----

  const handleSpecificationChange = (key, value) => {
    setProductDetailsForm((prev) => ({
      ...prev,
      specification: { ...prev.specification, [key]: value }
    }))
  }

  const addSpecification = () => {
    if (tempKey && tempValue) {
      handleSpecificationChange(tempKey, tempValue)
      setTempKey('')
      setTempValue('')
    }
  }

  const handleProductDetailsFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      if (value.length > 30) {
        alert('Product name should not exceed 30 characters')
        return
      }
    }
    setProductDetailsForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const removeSpecification = (key) => {
    const { [key]: _, ...rest } = productDetailsForm.specification
    if (Object.keys(productDetailsForm.specification).length > 1) {
      setProductDetailsForm((prev) => ({
        ...prev,
        specification: rest
      }))
    }
  }

  const handleMaterialChange = (material, index) => {
    const newMaterials = [...productDetailsForm.materials]
    newMaterials[index] = material
    setProductDetailsForm((prev) => ({
      ...prev,
      materials: newMaterials
    }))
  }

  const addMaterial = () => {
    setProductDetailsForm((prev) => ({
      ...prev,
      materials: [...prev.materials, '']
    }))
  }

  const removeMaterial = (index) => {
    const filteredMaterials = productDetailsForm.materials.filter(
      (_, idx) => idx !== index
    )
    if (productDetailsForm.materials.length > 1) {
      setProductDetailsForm((prev) => ({
        ...prev,
        materials: filteredMaterials
      }))
    }
  }

  const handleTagChange = (tag, index) => {
    const newTags = [...productDetailsForm.tags]
    newTags[index] = tag
    setProductDetailsForm((prev) => ({
      ...prev,
      tags: newTags
    }))
  }

  const addTag = () => {
    setProductDetailsForm((prev) => ({
      ...prev,
      tags: [...prev.tags, '']
    }))
  }

  const removeTag = (index) => {
    const filteredTags = productDetailsForm.tags.filter(
      (_, idx) => idx !== index
    )
    if (productDetailsForm.tags.length > 1) {
      setProductDetailsForm((prev) => ({
        ...prev,
        tags: filteredTags
      }))
    }
  }

  function generateHexRandomString() {
    // Create a buffer of 12 bytes
    const buffer = new Uint8Array(12)
    // Populate the buffer with random values
    window.crypto.getRandomValues(buffer)
    // Convert the bytes to a hex string
    const hexString = Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return hexString
  }

  useEffect(() => {
    setProductId(generateHexRandomString())
  }, [])

  const handleAdditionalImages = async () => {
    const formData = new FormData()
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        console.log(images[i])
        formData.append('images', images[i])
      }
    }

    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_REACT_APP_SERVER}/api/addAdditionalImages/${productId}`,
        formData
      )
    } catch (error) {
      alert('Failed to upload images')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {
      name,
      price,
      stock,
      category,
      description,
      delivery,
      specification,
      materials,
      tags
    } = productDetailsForm

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('delivery', delivery)
    formData.append('specification', JSON.stringify(specification))
    formData.append('materials', JSON.stringify(materials))
    formData.append('tags', JSON.stringify(tags))
    formData.append('randomId', productId)
    formData.append('thumbnail', thumbnail[0])

    try {
      await handleAdditionalImages()

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_REACT_APP_SERVER}/api/addProduct`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Product added successfully:', response.data)
      setProductId(generateHexRandomString())
      alert('Product added successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product. Please try again.')
    }
  }

  useEffect(() => {
    console.log(productDetailsForm)
  }, [productDetailsForm])

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[600px] space-y-4 rounded-xl bg-white p-4"
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
          Do not exceed 30 characters when entering the product name.
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
        <label className="mb-2 block text-lg font-semibold" htmlFor="Delivery">
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
            htmlFor="Category"
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
            <option value="sofa">Sofa</option>
            <option value="table">Table</option>
            <option value="chair">Chair</option>
            <option value="storage">Storage</option>
            <option value="bed">Bed</option>
          </select>
        </div>
        <div className="my-5">
          <label className="text-lg font-semibold">Specifications</label>
          <div className="my-3 flex items-center">
            <input
              type="text"
              placeholder="Key"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="rounded border px-2 py-1"
            />
            <input
              type="text"
              placeholder="Value"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="ml-2 rounded border px-2 py-1"
            />
            <button
              type="button"
              onClick={addSpecification}
              className="ml-2 rounded border border-slate-300 px-2 py-1 text-gray-500 transition-all duration-300 hover:bg-gray-200 hover:text-black"
            >
              Add/Update Spec
            </button>
          </div>
          {Object.entries(productDetailsForm.specification).map(
            ([key, value], index) => (
              <div key={index} className="mb-2 flex items-center">
                <div className="px-2 py-1">
                  {key}: {value}
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="ml-2 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
        <div className="flex flex-wrap justify-between">
          <div>
            <label className="block text-lg font-semibold">Materials</label>
            {productDetailsForm.materials.map((material, index) => (
              <div key={index} className="my-3 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Material"
                  value={material}
                  onChange={(e) => handleMaterialChange(e.target.value, index)}
                  className="rounded border px-2 py-1"
                />
                {productDetailsForm.materials.length > 1 && (
                  <button type="button" onClick={() => removeMaterial(index)}>
                    <X className="box-content size-4 rounded-full bg-red-500 stroke-white stroke-2 p-1" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMaterial}
              className="w-full rounded border border-slate-300 px-2 py-1 font-semibold transition-all duration-300 hover:bg-gray-200 hover:text-black"
            >
              Add Material
            </button>
          </div>
          <div className="my-2">
            <h3 className="mb-2 text-lg font-semibold">Tags</h3>
            {productDetailsForm.tags.map((tag, index) => (
              <div key={index} className="mb-2 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(e.target.value, index)}
                  className="rounded border px-2 py-1"
                />
                {productDetailsForm.tags.length > 1 && (
                  <button type="button" onClick={() => removeTag(index)}>
                    <X className="box-content size-4 rounded-full bg-red-500 stroke-white stroke-2 p-1" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="w-full rounded border border-slate-300 px-2 py-1 font-semibold transition-all duration-300 hover:bg-gray-200 "
            >
              Add Tag
            </button>
          </div>
        </div>
        <div>
          <label
            className="my-5 block text-lg font-semibold"
            htmlFor="dropzone-file"
          >
            Upload Thumbnail Image
          </label>
          <section className="container border border-black">
            <div
              {...getRootPropsThumbnail({ className: 'dropzone' })}
              className="grid h-[200px] w-full place-items-center"
            >
              <div className="flex cursor-pointer flex-col items-center gap-5">
                <input {...getInputPropsThumbnail()} />
                <ImagePlus size={40} />
                <p>
                  Drag and drop a thumbnail image, or click to select it from
                  your computer
                </p>
              </div>
            </div>
            <aside className="flex w-full flex-grow flex-wrap justify-center gap-5">
              {thumbsForThumbnail}
            </aside>
          </section>
        </div>
        <div>
          <label
            className="my-5 block text-lg font-semibold"
            htmlFor="dropzone-file"
          >
            Upload up to 3 additional images
          </label>
          <section className="container border border-black">
            <div
              {...getRootPropsImages({ className: 'dropzone' })}
              className="grid h-[200px] w-full place-items-center"
            >
              <div className="flex cursor-pointer flex-col items-center gap-5">
                <input {...getInputPropsImages()} />
                <ImagePlus size={40} />
                <p>
                  Drag and drop some images, or click to select them from your
                  computer
                </p>
              </div>
            </div>
            <aside className="flex w-full flex-grow flex-wrap justify-center gap-5">
              {thumbsForImages}
            </aside>
          </section>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="h-24 w-full rounded-md border border-black transition-all duration-300 hover:bg-slate-800 hover:text-white"
      >
        Send Data
      </button>
    </form>
  )
}

export default AddProduct
