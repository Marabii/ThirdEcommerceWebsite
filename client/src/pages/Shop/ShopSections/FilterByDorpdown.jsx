import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const FilterDropdown = ({ filters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentFilter = searchParams.get('filter') || 'all' // Default filter

  const handleDropdownToggle = () => setIsOpen(!isOpen)

  const handleFilterChange = (newFilter) => {
    if (newFilter.toLowerCase() !== currentFilter.toLowerCase()) {
      searchParams.set('filter', newFilter.toLowerCase())
      setSearchParams(searchParams)
      setIsOpen(false)
    }
  }

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        name="filter"
        id="filter"
        className="flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-left shadow-sm"
        onClick={handleDropdownToggle}
      >
        <div>
          Filter By:{' '}
          {currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
        </div>
        <ChevronDown
          className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100 ${filter.toLowerCase() === currentFilter.toLowerCase() ? 'bg-gray-200' : ''}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
