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
import axios from 'axios'
import SearchResults from './SearchResults'

const navbarElements = [
  { name: 'Home', link: '/' },
  { name: 'Pages', link: '/pages' },
  { name: 'About', link: '/about' },
  { name: 'Contact', link: '/contact' }
]

const Header = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, isLoggedIn } = useContext(globalContext)
  const jwtTokenUnDecoded = localStorage.getItem('jwtToken')
  const jwtToken = jwtTokenUnDecoded && jwtDecode(jwtTokenUnDecoded)
  const userId = jwtToken?.sub
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [isCartOpen])

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/search?query=${query}`)
      const data = response.data
      setResults(data.hits)
    } catch (error) {
      console.error('Failed to fetch:', error)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (timeoutId) clearTimeout(timeoutId)

    const newTimeoutId = setTimeout(() => {
      handleSearch()
    }, 400)

    setTimeoutId(newTimeoutId)
  }

  return (
    <header className="relative z-30 flex items-center justify-between p-6 font-playfair">
      <img src={logo} alt="logo" />
      {query.length !== 0 && <SearchResults hits={results} />}
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
            onChange={handleInputChange}
            type="text"
            placeholder="Search"
            name="search"
            className="h-10 w-40 bg-transparent indent-4 text-lg focus:outline-0"
          />
          <Search size={20} />
        </div>
        {isLoggedIn ? (
          <Link to={`/profile/${userId}`}>
            <CircleUserRound size={30} className="mr-5" />
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
