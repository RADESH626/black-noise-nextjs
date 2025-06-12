import React from 'react';

function InputCheckBox(props) {
  return (
    <input
      type="checkbox"
      {...props}
      className="w-5 h-5 bg-neutral-800 border-neutral-600 rounded text-accent1 focus:ring-accent1 focus:border-accent1"
    />
  );
}

export default InputCheckBox;
