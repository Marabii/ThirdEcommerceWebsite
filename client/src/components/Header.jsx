import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Menu,
  CircleUserRound,
  ShoppingBag,
  ArrowDown,
  Key
} from 'lucide-react'
import logo from '/farnic.png'
import SideBarHeader from './SideBarHeader'
import CartContainer from './CartContainer'
import { globalContext } from '../App'
import axios from 'axios'
import SearchResults from './SearchResults'

const Header = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, isLoggedIn, userData } = useContext(globalContext)
  const isAdmin = userData.isAdmin
  const userId = userData._id
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [scrolled, setScrolled] = useState(false)
  const [searchLoaded, setSearchLoaded] = useState(false)
  const isFirstRender = useRef(true)

  const navbarElements = [
    { name: 'Home', link: '/' },
    { name: 'Pages', link: '/pages' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' }
  ]

  useEffect(() => {
    console.log('Current isFirstRender:', isFirstRender.current)
    console.log('Current cartItems.length:', cartItems.length)
    if (isFirstRender.current && cartItems.length > 0) {
      isFirstRender.current = false
    } else {
      setIsCartOpen(true)
    }
  }, [cartItems])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [isCartOpen])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (timeoutId) clearTimeout(timeoutId)
    const newTimeoutId = setTimeout(() => {
      handleSearch(value)
    }, 400)

    setTimeoutId(newTimeoutId)
  }

  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `${serverURL}/api/search?query=${encodeURIComponent(searchValue)}`
      )
      const data = response.data
      setResults(data.hits)
      setSearchLoaded(true)
    } catch (error) {
      console.error('Failed to fetch:', error)
      setSearchLoaded(false)
    }
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 flex items-center justify-between p-2 font-playfair transition-all duration-500 sm:p-6 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    >
      {query.length !== 0 && (
        <SearchResults
          hits={results}
          searchLoaded={searchLoaded}
          setQuery={setQuery}
        />
      )}
      <img src={logo} alt="logo" />
      <nav className="hidden xl:block">
        <ul className="flex space-x-20">
          {navbarElements.map((element) => (
            <Link key={element.name} to={element.link}>
              <li className="flex items-center gap-2 font-bold">
                {' '}
                {element.name}{' '}
                {element.name === 'Pages' && <ArrowDown size={15} />}
              </li>
            </Link>
          ))}
          {isAdmin && (
            <Link to={'/admin/dashboard'}>
              <li className="flex items-center gap-2 font-bold">Admin Panel</li>
            </Link>
          )}
        </ul>
      </nav>
      <div className="flex items-center">
        <div className="mr-10 hidden items-center border-b border-gray-500 xl:flex">
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="Search"
            value={query}
            name="search"
            className="h-10 w-40 bg-transparent indent-1 text-lg focus:outline-0"
          />
          <Search color="rgb(107 114 128)" size={20} />
        </div>
        {isLoggedIn ? (
          <Link to={`/profile/${userId}`}>
            <div className="mr-3 flex items-center justify-between gap-2 rounded-md border border-gray-500 p-1">
              <CircleUserRound
                color="rgb(107 114 128)"
                strokeWidth={1}
                size={30}
                className="mr-5"
              />
              <p>Profile</p>
            </div>
          </Link>
        ) : (
          <Link to={'/login'}>
            <div className="mr-3 flex items-center justify-between gap-2 rounded-md border border-gray-500 p-1">
              <Key color="rgb(107 114 128)" size={30} strokeWidth={1} />
              <p>Log In</p>
            </div>
          </Link>
        )}
        <div className="relative" onClick={() => setIsCartOpen(!isCartOpen)}>
          <ShoppingBag
            className="cursor-pointer"
            size={30}
            stroke="rgb(107 114 128)"
            strokeWidth={1}
          />
          <div className="text-jost absolute -right-1 -top-1 grid h-5 w-5 content-end rounded-full bg-gray-700 text-center text-white">
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
          SearchResults={SearchResults}
          hits={results}
          handleSearch={handleSearch}
          handleInputChange={handleInputChange}
          isAdmin={isAdmin}
        />
      )}
      {isCartOpen && (
        <CartContainer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      )}
    </header>
  )
}

export default Header
