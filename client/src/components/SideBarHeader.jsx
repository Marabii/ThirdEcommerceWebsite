import React from 'react'
import { X, Search, ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const SideBarHeader = (props) => {
  const { setIsMenuOpen, navbarElements } = props

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-black bg-opacity-50"
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className="min-width-custom fixed left-0 top-0 z-20 h-screen bg-white p-6">
        <X
          size={30}
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-2 top-3 cursor-pointer stroke-black"
        />
        <img className="mx-auto" src="/farnic.png" alt="Farnic logo" />
        <div className="my-5 flex w-full items-center">
          <input
            type="text"
            placeholder="Search"
            name="search"
            id="search"
            className="w-full border-b border-black text-black focus:outline-none"
          />
          <Search size={20} />
        </div>
        <nav>
          <ul className="space-y-3">
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
      </div>
    </>
  )
}

export default SideBarHeader