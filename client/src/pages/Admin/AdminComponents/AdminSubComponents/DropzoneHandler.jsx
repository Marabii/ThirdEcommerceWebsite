import { useDropzone } from 'react-dropzone'
import { useCallback, useEffect } from 'react'
import { ImagePlus, X } from 'lucide-react'

const DropzoneHandler = ({
  images,
  setImages,
  thumbnail,
  setThumbnail,
  setHasThumbnailChanged,
  setHaveImagesChanged
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 3) {
      alert('You can only upload up to 3 images')
      setImages([])
    } else {
      setHaveImagesChanged(true)
      setImages(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  }, [])

  const useDropZoneImages = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  })

  const getRootPropsImages = useDropZoneImages.getRootProps
  const getInputPropsImages = useDropZoneImages.getInputProps

  const useDropZoneThumbnail = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setHasThumbnailChanged(true)
      setThumbnail(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  })

  const getRootPropsThumbnail = useDropZoneThumbnail.getRootProps
  const getInputPropsThumbnail = useDropZoneThumbnail.getInputProps

  useEffect(() => {
    setTimeout(() => {
      images.forEach((file) => URL.revokeObjectURL(file.preview))
    }, 1000)
  }, [images])

  const thumbsForImages = images.map((file) => (
    <div key={file.name} className="my-10">
      <div className="relative flex w-fit gap-2 rounded-md border-2 border-black p-2 align-top">
        <img src={file.preview} className="size-28" />
        <X
          size={20}
          className="absolute right-1 top-1 box-content cursor-pointer rounded-full bg-red-600 stroke-white p-1"
          onClick={() =>
            setImages((prev) => {
              return prev.filter((image) => image.name !== file.name)
            })
          }
        />
      </div>
    </div>
  ))

  const thumbsForThumbnail = thumbnail.map((file) => (
    <div key={file.name} className="my-10">
      <div className="relative flex w-fit gap-2 rounded-md border-2 border-black p-2 align-top">
        <img src={file.preview} className="size-28" />
        <X
          size={20}
          className="absolute right-1 top-1 box-content cursor-pointer rounded-full bg-red-600 stroke-white p-1"
          onClick={() =>
            setThumbnail((prev) => {
              return prev.filter((image) => image.name !== file.name)
            })
          }
        />
      </div>
    </div>
  ))
  return (
    <>
      <div>
        <label
          className="my-5 block text-lg font-semibold"
          htmlFor="dropzone-file"
        >
          Upload Thumbnail Image
        </label>
        <section
          htmlFor="dropzone-file"
          className="container rounded-md border border-black"
        >
          <div
            {...getRootPropsThumbnail({ className: 'dropzone' })}
            className="grid h-[200px] w-full place-items-center"
          >
            <div className="flex cursor-pointer flex-col items-center gap-5">
              <input {...getInputPropsThumbnail()} />
              <ImagePlus size={40} />
              <p>
                Drag and drop a thumbnail image, or click to select it from your
                computer
              </p>
            </div>
          </div>
          <aside className="flex w-full flex-grow flex-wrap justify-center gap-5">
            {thumbsForThumbnail}
          </aside>
        </section>
      </div>
      <div>
        <label
          className="my-5 block text-lg font-semibold"
          htmlFor="dropzone-file"
        >
          Upload up to 3 additional images
        </label>
        <section
          htmlFor="dropzone-file"
          className="container rounded-md border border-black"
        >
          <div
            {...getRootPropsImages({ className: 'dropzone' })}
            className="grid h-[200px] w-full place-items-center"
          >
            <div className="flex cursor-pointer flex-col items-center gap-5">
              <input {...getInputPropsImages()} />
              <ImagePlus size={40} />
              <p>
                Drag and drop some images, or click to select them from your
                computer
              </p>
            </div>
          </div>
          <aside className="flex w-full flex-grow flex-wrap justify-center gap-5">
            {thumbsForImages}
          </aside>
        </section>
      </div>
    </>
  )
}

export default DropzoneHandler
