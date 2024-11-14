import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const FilterByMaterials = ({ materials }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentMaterial = searchParams.get('material') || 'all' // Default material

  const handleDropdownToggle = () => setIsOpen(!isOpen)

  const handleMaterialChange = (newMaterial) => {
    if (newMaterial.toLowerCase() !== currentMaterial.toLowerCase()) {
      searchParams.set('material', newMaterial)
      setSearchParams(searchParams)
      setIsOpen(false) // Close the dropdown after selection
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
        className="flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-left shadow-sm"
        onClick={handleDropdownToggle}
      >
        <div>
          Material:{' '}
          {currentMaterial.charAt(0).toUpperCase() + currentMaterial.slice(1)}
        </div>
        <ChevronDown
          className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 h-52 w-full overflow-y-scroll rounded-md border border-gray-300 bg-white shadow-lg">
          {['All', ...materials].map((material) => (
            <button
              key={material}
              className={`w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100 ${material.toLowerCase() === currentMaterial.toLowerCase() ? 'bg-gray-200' : ''}`}
              onClick={() => handleMaterialChange(material)}
            >
              {material}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterByMaterials
