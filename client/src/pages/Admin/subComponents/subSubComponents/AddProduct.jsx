import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus } from 'lucide-react'

const AddProduct = () => {
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

  const [tempKey, setTempKey] = useState('')
  const [tempValue, setTempValue] = useState('')
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  })

  useEffect(() => {
    setTimeout(() => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }, 1000)
  }, [files])

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

  const thumbs = files.map((file) => (
    <div key={file.name} className="max-w-[120px]">
      <div>
        <img src={file.preview} />
      </div>
    </div>
  ))

  return (
    <div className="max-w-[600px] space-y-4 rounded-xl bg-white p-4">
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
        <div>
          <label
            className="mb-2 block text-lg font-semibold"
            htmlFor="Category"
          >
            Category
          </label>
          <select
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
          <label className="text-lg font-semibold">Specifications:</label>
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
        <div>
          <div>
            <label className="block text-lg font-semibold">Materials:</label>
            {productDetailsForm.materials.map((material, index) => (
              <div key={index} className="my-3 flex items-center">
                <input
                  type="text"
                  placeholder="Material"
                  value={material}
                  onChange={(e) => handleMaterialChange(e.target.value, index)}
                  className="rounded border px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="ml-2 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMaterial}
              className="mt-1 w-[150px] rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700"
            >
              Add Material
            </button>
          </div>
          <div className="my-2">
            <h3 className="mb-2 text-lg font-semibold">Tags:</h3>
            {productDetailsForm.tags.map((tag, index) => (
              <div key={index} className="mb-2 flex items-center">
                <input
                  type="text"
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(e.target.value, index)}
                  className="rounded border px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="mt-1 w-[150px] rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700"
            >
              Add Tag
            </button>
          </div>
          <div>
            <section className="container">
              <div
                {...getRootProps({ className: 'dropzone' })}
                className="grid h-[200px] w-full place-items-center"
              >
                <div className="flex cursor-pointer flex-col items-center gap-5">
                  <input {...getInputProps()} />
                  <ImagePlus size={40} />
                  <p>Drag and drop some files here, or click to select files</p>
                </div>
              </div>
              <aside className="flex w-full flex-grow flex-wrap justify-center gap-5">
                {thumbs}
              </aside>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
