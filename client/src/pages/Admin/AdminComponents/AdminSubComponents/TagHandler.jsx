import { X } from 'lucide-react'

const TagHandler = ({ productDetailsForm, setProductDetailsForm }) => {
  const handleTagChange = (tag, index) => {
    const newTags = [...productDetailsForm.tags]
    newTags[index] = tag
    setProductDetailsForm((prev) => ({
      ...prev,
      tags: newTags
    }))
  }

  const addTag = () => {
    setProductDetailsForm((prev) => ({
      ...prev,
      tags: [...prev.tags, '']
    }))
  }

  const removeTag = (index) => {
    const filteredTags = productDetailsForm.tags.filter(
      (_, idx) => idx !== index
    )
    if (productDetailsForm.tags.length > 1) {
      setProductDetailsForm((prev) => ({
        ...prev,
        tags: filteredTags
      }))
    }
  }
  return (
    <div className="my-2">
      <h3 className="mb-2 text-lg font-semibold">Tags</h3>
      {productDetailsForm.tags.map((tag, index) => (
        <div key={index} className="mb-2 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={(e) => handleTagChange(e.target.value, index)}
            className="rounded border px-2 py-1"
          />
          {productDetailsForm.tags.length > 1 && (
            <button type="button" onClick={() => removeTag(index)}>
              <X className="box-content size-4 rounded-full bg-red-500 stroke-white stroke-2 p-1" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addTag}
        className="w-full rounded border border-slate-300 px-2 py-1 font-semibold transition-all duration-300 hover:bg-gray-200 "
      >
        Add Tag
      </button>
    </div>
  )
}

export default TagHandler
