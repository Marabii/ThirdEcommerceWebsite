import { useState, useEffect, useContext } from 'react'
import { globalContext } from '../../../App'
import axiosInstance from '../../../utils/verifyJWT'

const Comments = (props) => {
  const { productsData, orderData } = props
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { userData } = useContext(globalContext)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    if (productsData.length !== 0) {
      setSelectedProduct(productsData[0]._id)
    }
  }, [productsData])

  const postComment = async (e) => {
    e.preventDefault()
    const comment = document.querySelector('#comment').value
    if (!comment) return alert('Please enter a comment')
    try {
      await axiosInstance.post(`${serverURL}/api/postComment`, {
        comment: comment,
        productId: selectedProduct,
        postedBy: userData._id
      })
      alert('Comment posted successfully')
      document.querySelector('#comment').value = ''
    } catch (e) {
      alert('Error posting comment')
      console.error(e)
    }
  }

  const handleSelectedProduct = (e) => {
    setSelectedProduct(e.target.value)
  }

  return (
    <section>
      <h2 className="my-5 w-full bg-slate-100 p-5 text-center text-3xl font-semibold">
        Leave a review
      </h2>
      <form className="grid space-y-5 p-4">
        <div className="flex justify-between">
          <label htmlFor="productToCommentOn" className="block">
            You bought {orderData.cart.length} product
            {orderData.cart.length > 1 ? 's' : ''}. Please select the product
            you would like to leave a review for:
          </label>
          <select
            name="productToCommentOn"
            id="productToCommentOn"
            onChange={handleSelectedProduct}
            value={selectedProduct}
          >
            {productsData.map((product, index) => (
              <option key={product._id} value={product._id}>
                Product {index + 1}: {product.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="h-40 w-full rounded-md border border-slate-400 p-2"
          name="comment"
          id="comment"
          placeholder="Leave a comment here"
        ></textarea>
        <button
          className={`justify-self-center rounded-md border-2 border-slate-500 px-4 py-3  transition-all duration-300 hover:bg-slate-500 hover:text-white`}
          onClick={postComment}
        >
          Post Comment
        </button>
      </form>
    </section>
  )
}

export default Comments
