import AddProduct from './AdminSubComponents/AddProduct'
import UpdateProduct from './AdminSubComponents/UpdateProduct'
import DeleteProduct from './AdminSubComponents/DeleteProduct'

const HandleProducts = () => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5">
      <AddProduct />
      <div className="flex flex-col gap-5">
        <UpdateProduct />
        <DeleteProduct />
      </div>
    </div>
  )
}

export default HandleProducts
