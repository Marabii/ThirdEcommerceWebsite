import { useState } from 'react'

const SpecificationHandler = ({
  productDetailsForm,
  setProductDetailsForm
}) => {
  const [tempKey, setTempKey] = useState('')
  const [tempValue, setTempValue] = useState('')

  const handleSpecificationChange = (key, value) => {
    setProductDetailsForm((prev) => ({
      ...prev,
      specification: { ...prev.specification, [key]: value }
    }))
  }

  const addSpecification = () => {
    if (tempKey && tempValue) {
      handleSpecificationChange(tempKey, tempValue)
      setTempKey('')
      setTempValue('')
    }
  }

  const removeSpecification = (key) => {
    const { [key]: _, ...rest } = productDetailsForm.specification
    // if (Object.keys(productDetailsForm.specification).length > 1) {
    setProductDetailsForm((prev) => ({
      ...prev,
      specification: rest
    }))
    // }
  }
  return (
    <div className="my-5">
      <label htmlFor="specification" className="text-lg font-semibold">
        Specifications
      </label>
      <div id="specification" className="my-3 flex items-center">
        <input
          type="text"
          placeholder="Key"
          value={tempKey}
          onChange={(e) => setTempKey(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <input
          type="text"
          placeholder="Value"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="ml-2 rounded border px-2 py-1"
        />
        <button
          type="button"
          onClick={addSpecification}
          className="ml-2 rounded border border-slate-300 px-2 py-1 text-gray-500 transition-all duration-300 hover:bg-gray-200 hover:text-black"
        >
          Add/Update Spec
        </button>
      </div>
      {Object.entries(productDetailsForm.specification).map(
        ([key, value], index) => (
          <div key={index} className="mb-2 flex items-center">
            <div className="px-2 py-1">
              {key}: {value}
            </div>
            <button
              type="button"
              onClick={() => removeSpecification(key)}
              className="ml-2 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default SpecificationHandler
