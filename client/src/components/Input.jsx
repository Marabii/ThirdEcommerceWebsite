import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Input = (props) => {
  const { type, name, placeholder } = props
  const [isFocused, setIsFocused] = useState(false)
  const inputContainerRef = useRef(null)

  const handleClick = () => {
    setIsFocused(true)
  }

  const handleOutsideClick = (event) => {
    if (
      inputContainerRef.current &&
      !inputContainerRef.current.contains(event.target)
    ) {
      setIsFocused(false)
    }
  }

  useEffect(() => {
    // Add when the component is mounted
    document.addEventListener('mousedown', handleOutsideClick)

    // Cleanup when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, []) // Empty dependency array ensures this only runs on mount and unmount

  return (
    <div ref={inputContainerRef} className="relative">
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute left-[10px] top-0 z-10 -translate-y-1/2 bg-white text-xs"
            initial={{ top: '50%', fontSize: 16 }}
            animate={{ top: 0, fontSize: 12 }}
          >
            {placeholder}
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onClick={handleClick}
        className="h-[50px] w-[500px] p-5"
      />
    </div>
  )
}

export default Input
