import { X, Search, ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchResults from './SearchResults'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SideBarHeader = ({
  hits,
  query,
  setQuery,
  searchLoaded,
  setIsMenuOpen,
  navbarElements,
  isAdmin,
  handleInputChange
}) => {
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  }

  const inputVariants = {
    hidden: { scale: 0.98 },
    visible: { scale: 1, transition: { duration: 0.5 } }
  }

  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.4 }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-10 bg-black bg-opacity-50"
        onClick={() => setIsMenuOpen(false)}
      ></motion.div>

      <motion.div
        className="min-width-custom fixed left-0 top-0 z-20 h-screen bg-white p-6"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <X
          size={30}
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-2 top-3 cursor-pointer stroke-black"
        />
        <img className="mx-auto" src="/farnic.png" alt="Farnic logo" />
        <motion.div
          className="my-5 flex w-full items-center"
          variants={inputVariants}
        >
          <input
            type="text"
            placeholder="Search"
            name="search"
            id="search"
            onChange={handleInputChange}
            value={query}
            className="w-full border-b border-black text-black focus:outline-none"
          />
          <Search size={20} />
        </motion.div>
        <div className="z-20">
          {query.length !== 0 && (
            <SearchResults
              hits={hits}
              searchLoaded={searchLoaded}
              setQuery={setQuery}
            />
          )}
        </div>
        <nav>
          <ul className="space-y-3">
            {navbarElements.map((element, index) => (
              <motion.li variants={linkVariants} key={index}>
                <Link
                  key={index}
                  to={element.link}
                  className="flex items-center gap-2 font-bold"
                >
                  {element.name}{' '}
                  {element.name === 'Pages' && <ArrowDown size={15} />}
                </Link>
              </motion.li>
            ))}
            {isAdmin && (
              <motion.li variants={linkVariants}>
                <Link
                  className="flex items-center gap-2 font-bold"
                  to={'/admin/dashboard'}
                >
                  Admin Panel
                </Link>
              </motion.li>
            )}
          </ul>
        </nav>
      </motion.div>
    </AnimatePresence>
  )
}

export default SideBarHeader
