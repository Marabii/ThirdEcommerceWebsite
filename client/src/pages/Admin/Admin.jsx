import useAdminAccess from '../../utils/useAdminAccess'
import SideBarAdmin from './AdminComponents/SideBar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './AdminComponents/Dashboard'
import HandleProducts from './AdminComponents/HandleProducts'
import Header from '../../components/Header'

const Admin = () => {
  const { ToastContainer } = useAdminAccess()

  return (
    <>
      <div className="flex overflow-x-hidden">
        <Header />
        <main className="mx-2 mt-[150px] flex w-full space-x-2 rounded-xl p-5">
          <SideBarAdmin />
          <div className="flex w-full bg-slate-100 p-5">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ecommerce" element={<HandleProducts />} />
            </Routes>
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  )
}

export default Admin
