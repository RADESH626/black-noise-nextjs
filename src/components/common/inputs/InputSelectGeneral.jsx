import React from 'react';

function InputSelectGeneral({ children, options, placeholder, defaultValue, className = '', ...rest }) {
  const combinedClasses = `w-full p-3 bg-neutral-800 text-secondary border border-accent1 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-accent1 ${className}`;

  return (
    <select 
      className={combinedClasses}
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
  );
}

export default InputSelectGeneral;
