import { X } from 'lucide-react'

const MaterialHandler = ({ productDetailsForm, setProductDetailsForm }) => {
  const handleMaterialChange = (material, index) => {
    const newMaterials = [...productDetailsForm.materials]
    newMaterials[index] = material
    setProductDetailsForm((prev) => ({
      ...prev,
      materials: newMaterials
    }))
  }

  const addMaterial = () => {
    setProductDetailsForm((prev) => ({
      ...prev,
      materials: [...prev.materials, '']
    }))
  }

  const removeMaterial = (index) => {
    const filteredMaterials = productDetailsForm.materials.filter(
      (_, idx) => idx !== index
    )
    if (productDetailsForm.materials.length > 1) {
      setProductDetailsForm((prev) => ({
        ...prev,
        materials: filteredMaterials
      }))
    }
  }

  return (
    <div>
      <label htmlFor="materials" className="block text-lg font-semibold">
        Materials
      </label>
      {productDetailsForm.materials.map((material, index) => (
        <div
          id="materials"
          key={index}
          className="my-3 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Material"
            value={material}
            onChange={(e) => handleMaterialChange(e.target.value, index)}
            className="rounded border px-2 py-1"
          />
          {productDetailsForm.materials.length > 1 && (
            <button type="button" onClick={() => removeMaterial(index)}>
              <X className="box-content size-4 rounded-full bg-red-500 stroke-white stroke-2 p-1" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addMaterial}
        className="w-full rounded border border-slate-300 px-2 py-1 font-semibold transition-all duration-300 hover:bg-gray-200 hover:text-black"
      >
        Add Material
      </button>
    </div>
  )
}

export default MaterialHandler
