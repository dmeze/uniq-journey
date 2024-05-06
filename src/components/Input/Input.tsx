const Input = ({
  id,
  type,
  label,
  key,
}: {
  id: string
  type: string
  label: string
  key?: string
}) => {
  return (
    <div className="group relative mb-6 w-full" key={key}>
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
        type={type}
        name={id}
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

export default Input
