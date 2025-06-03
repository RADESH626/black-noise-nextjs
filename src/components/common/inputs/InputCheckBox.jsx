import React from 'react'

function InputCheckBox(props) {
  return (
    <input
      type="checkbox"
      {...props}
      className="w-5 h-5 bg-gray-100 border-gray-300 rounded  "
    />
  )
}

export default InputCheckBox