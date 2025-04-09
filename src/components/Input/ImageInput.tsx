import type { FormikProps } from 'formik'

interface ImageInputProps {
  id: string
  label: string
  onImageChange: (image: string | null) => void
  formik?: FormikProps<any>
}

const ImageInput = ({ id, label, onImageChange, formik }: ImageInputProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result as string
        onImageChange(imageUrl)
        formik?.setFieldValue(
          'image',
          JSON.stringify(e.target.files ? e.target.files[0] : {}),
        )
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="group relative mb-6 w-full" key={id}>
      <input
        className="
          peer block w-full
          appearance-none
          rounded-none border-0 border-b-2
          border-light-green-600
          bg-transparent px-0
          py-3
          text-sm text-dark-green-600
          outline-none
          ring-0
          duration-300 hover:border-dark-green-600
          focus:border-dark-green-600
        "
        id={id}
        type="file"
        accept="image/*"
        name={id}
        onChange={handleImageChange}
        placeholder=""
        required
      />
      <label
        className="
          absolute top-3 origin-[0]
          -translate-y-6 scale-75 text-sm font-bold
          text-light-green-100 duration-300
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
          peer-hover:border-dark-green-600 peer-hover:text-dark-green-600 peer-focus:start-0
          peer-focus:-translate-y-6 peer-focus:scale-75
          peer-focus:text-dark-green-600
        "
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}

export default ImageInput
