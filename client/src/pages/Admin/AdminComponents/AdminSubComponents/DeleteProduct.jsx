import { useState } from 'react'
import SearchHandler from './SearchHandler'
import CardItemId from '../../../../components/CardItemId'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../../../utils/verifyJWT'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DeleteProduct = () => {
  const [currentProduct, setCurrentProduct] = useState('')
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const [loaded, setLoaded] = useState(true)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  }

  const deleteProduct = async () => {
    try {
      await axiosInstance.delete(
        `${serverURL}/api/deleteProduct/${currentProduct}`
      )

      toast.success('Product deleted successfully')
    } catch (e) {
      alert('Failed to delete product')
      console.error(e)
    }
  }

  return (
    <form className="h-fit w-[580px] space-y-4 rounded-xl bg-white p-4">
      <h1 className="mb-5 text-2xl font-bold">Delete Product</h1>
      {currentProduct === '' ? (
        <SearchHandler
          setCurrentProduct={setCurrentProduct}
          placeholder="Enter the name of the product you want to delete"
        />
      ) : (
        <>
          <div
            className="relative w-fit"
            onMouseEnter={() => setShowDeleteButton(true)}
            onMouseLeave={() => setShowDeleteButton(false)}
          >
            <CardItemId
              key={currentProduct}
              productId={currentProduct}
              display={false}
              width={250}
              setLoaded={setLoaded}
              loading={loaded}
            />
            <AnimatePresence>
              {showDeleteButton && (
                <motion.div
                  className="absolute inset-0 grid place-items-center bg-[rgba(0,0,0,0.5)]"
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <button
                    className="rounded bg-red-500 p-2 text-white transition-all duration-300 hover:bg-red-700"
                    onClick={deleteProduct}
                  >
                    Click To Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setCurrentProduct('')}
            className="rounded-md bg-slate-200 px-3 py-2 transition-all duration-300 hover:bg-slate-300"
          >
            Reset Search
          </button>
        </>
      )}
      <ToastContainer />
    </form>
  )
}

export default DeleteProduct
