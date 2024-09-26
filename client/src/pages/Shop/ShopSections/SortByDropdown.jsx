import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const SortByDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sortOrder = searchParams.get('sort') || 'price-desc' // Default sort order
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortingOptions = [
    { label: 'Price Ascending', value: 'price-asc' },
    { label: 'Price Descending', value: 'price-desc' },
    { label: 'Discount', value: 'promo-desc' }
  ]

  const handleDropdownToggle = () => setIsOpen(!isOpen)

  const handleOptionClick = (value) => {
    if (value !== sortOrder) {
      // Update only if different to avoid unnecessary changes
      searchParams.set('sort', value)
      setSearchParams(searchParams)
    }
    setIsOpen(false) // Close the dropdown after selection
  }

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        name="sortBy"
        id="sortBy"
        className="flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-left shadow-sm"
        onClick={handleDropdownToggle}
      >
        Sort:{' '}
        {sortingOptions.find((option) => option.value === sortOrder)?.label}
        <ChevronDown
          className={`ml-2 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {sortingOptions.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortByDropdown
