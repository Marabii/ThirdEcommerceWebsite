import { useState } from 'react'
import { X } from 'lucide-react'

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
    setProductDetailsForm((prev) => ({
      ...prev,
      specification: rest
    }))
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
          <div
            key={index}
            className="mb-2 flex w-full items-center justify-between rounded-md bg-slate-200 p-2"
          >
            <div className="px-2 py-1">
              {key}: {value}
            </div>
            <button type="button" onClick={() => removeSpecification(key)}>
              <X className="box-content size-4 rounded-full bg-red-500 stroke-white stroke-2 p-1" />
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default SpecificationHandler
