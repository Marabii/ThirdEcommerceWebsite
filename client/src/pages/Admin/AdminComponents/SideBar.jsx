import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, ScanLine, User } from 'lucide-react'

const SideBarAdmin = () => {
  const linkStyle = 'mb-5 flex space-x-3 rounded-md px-3 py-2'
  const activeStyle = 'bg-blue-100 text-blue-700'

  return (
    <div className="h-full w-[250px] bg-white p-5 shadow-xl">
      <div className="fixed">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
          <LayoutDashboard
            className={({ isActive }) =>
              `stroke-current ${isActive ? 'text-blue-500' : 'text-black'}`
            }
          />
          <p className="text-lg font-semibold">Dashboard</p>
        </NavLink>
        <NavLink
          to="/admin/ecommerce"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
          <ShoppingCart
            className={({ isActive }) =>
              `stroke-current ${isActive ? 'text-blue-500' : 'text-black'}`
            }
          />
          <p className="text-lg font-semibold">Ecommerce</p>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
          <ScanLine
            className={({ isActive }) =>
              `stroke-current ${isActive ? 'text-blue-500' : 'text-black'}`
            }
          />
          <p className="text-lg font-semibold">Orders</p>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
          <User
            className={({ isActive }) =>
              `stroke-current ${isActive ? 'text-blue-500' : 'text-black'}`
            }
          />
          <p className="text-lg font-semibold">Users</p>
        </NavLink>
      </div>
    </div>
  )
}

export default SideBarAdmin
