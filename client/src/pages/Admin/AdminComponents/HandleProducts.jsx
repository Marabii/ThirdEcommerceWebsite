import AddProduct from './AdminSubComponents/AddProduct'
import UpdateProduct from './AdminSubComponents/UpdateProduct'

const HandleProducts = () => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5">
      <AddProduct />
      <UpdateProduct />
    </div>
  )
}

export default HandleProducts
