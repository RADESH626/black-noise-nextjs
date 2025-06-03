import React from 'react';

export const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
    >
      {children}
    </button>
  );
};
