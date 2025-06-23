import React from 'react'

function InputCheckBox({ onCheckedChange, checked, ...restProps }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      {...restProps}
      className="w-5 h-5 bg-gray-100 border-gray-300 rounded  "
    />
  )
}

export default InputCheckBox
