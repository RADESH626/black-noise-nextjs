function InputSelectGeneral({ children, options, placeholder, defaultValue, ...rest }) {
  return (
    <select 
      className='
        w-full
        p-3
        bg-white
        text-black
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
        options.map((option) => {
          const value = typeof option === 'object' ? option.value : option;
          const label = typeof option === 'object' ? option.label : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })
      ) : (
        children
      )}
    </select>
  )
}

export default InputSelectGeneral
