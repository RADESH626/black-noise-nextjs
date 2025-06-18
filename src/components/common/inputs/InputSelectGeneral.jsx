function InputSelectGeneral({ children, options, placeholder, defaultValue, ...rest }) {
  return (
    <select 
      className='
        w-full
        p-3
        bg-black
        text-white
        border
        border-bn-accent
        rounded-md
        focus:outline-none
        focus:ring-1
        focus:ring-bn-accent-opaque
        focus:border-bn-accent-opaque
      '
      defaultValue={defaultValue}

      {...rest}
      
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      
      {options ? (
        options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))
      ) : (
        children
      )}
    </select>
  )
}

export default InputSelectGeneral
