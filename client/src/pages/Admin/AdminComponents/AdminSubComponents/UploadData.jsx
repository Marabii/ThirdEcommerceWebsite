import { useEffect, useState } from 'react'
import axiosInstance from '../../../../utils/verifyJWT'

const UploadData = ({
  productDetailsForm,
  setProductDetailsForm,
  thumbnail,
  setThumbnail,
  images,
  setImages
}) => {
  const [productId, setProductId] = useState('')
  function generateHexRandomString() {
    const buffer = new Uint8Array(12)
    window.crypto.getRandomValues(buffer)
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
      productDetails,
      tags
    } = productDetailsForm

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('delivery', delivery)
    formData.append('productDetails', productDetails)
    formData.append('specification', JSON.stringify(specification))
    formData.append(
      'materials',
      JSON.stringify(materials.map((m) => m.trim()).filter((m) => m !== ''))
    )
    formData.append(
      'tags',
      JSON.stringify(tags.map((tag) => tag.trim()).filter((tag) => tag !== ''))
    )
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

      // Show success message
      alert('Product added successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product. Please try again.')
    }
  }

  return {
    handleSubmit
  }
}

export default UploadData
