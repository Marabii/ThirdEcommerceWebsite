import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Menu,
  CircleUserRound,
  ShoppingBag,
  ArrowDown
} from 'lucide-react'
import logo from '/farnic.png'
import SideBarHeader from './SideBarHeader'
import CartContainer from './CartContainer'
import { globalContext } from '../App'
import { jwtDecode } from 'jwt-decode'

const navbarElements = [
  { name: 'Home', link: '/' },
  { name: 'Pages', link: '/pages' },
  { name: 'About', link: '/about' },
  { name: 'Contact', link: '/contact' }
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, isLoggedIn } = useContext(globalContext)
  const jwtTokenUnDecoded = localStorage.getItem('jwtToken')
  const jwtToken = jwtTokenUnDecoded && jwtDecode(jwtTokenUnDecoded)
  const userId = jwtToken?.sub

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [isCartOpen])

  return (
    <header className="flex items-center justify-between p-6 font-playfair">
      <img src={logo} alt="logo" />
      <nav className="hidden xl:block">
        <ul className="flex space-x-20">
          {navbarElements.map((element) => (
            <Link
              key={element.name}
              to={element.link}
              className="flex items-center gap-2 font-bold"
            >
              {element.name}{' '}
              {element.name === 'Pages' && <ArrowDown size={15} />}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="flex items-center">
        <div className="relative top-1 mr-10 hidden items-center border-b-2 border-black md:flex">
          <input
            type="text"
            placeholder="Search"
            name="search"
            className="h-10 w-40 bg-transparent indent-4 text-lg focus:outline-0"
          />
          <Search size={20} />
        </div>
        {isLoggedIn ? (
          <Link to={`/profile/${userId}`}>
            <CircleUserRound userId={userId} size={30} className="mr-5" />
          </Link>
        ) : (
          <Link to={'/login'}>
            <CircleUserRound size={30} className="mr-5" />
          </Link>
        )}
        <div className="relative">
          <ShoppingBag
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="cursor-pointer"
            size={30}
          />
          <div className="text-jost absolute -right-1 -top-1 grid h-5 w-5 content-end rounded-full bg-black text-center text-white">
            {cartItems.length}
          </div>
        </div>
        <Menu
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-5 block cursor-pointer xl:hidden"
        />
      </div>
      {isMenuOpen && (
        <SideBarHeader
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          navbarElements={navbarElements}
        />
      )}
      {isCartOpen && (
        <CartContainer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      )}
    </header>
  )
}

export default Header
