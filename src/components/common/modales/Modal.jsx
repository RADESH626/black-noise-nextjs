"use client";

import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, title, size = 'default' }) => {
  const sizeClasses = {
    small: 'w-[95%] sm:w-[400px]',
    default: 'w-[95%] sm:w-[85%] md:w-[75%] lg:w-[600px]',
    large: 'w-[95%] sm:w-[85%] md:w-[85%] lg:w-[800px]',
    full: 'w-[95%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[1200px]'
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Previene el scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset'; // Restaura el scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn transition-all duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`bg-black p-4 sm:p-6 rounded-lg shadow-[0_0_25px_rgba(168,85,247,0.15)] relative mx-auto animate-slideUp border border-purple-500 transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] ${sizeClasses[size]}`}>
        {title && (
          <h2 id="modal-title" className="text-xl font-semibold mb-4 text-purple-400">
            {title}
          </h2>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-400 hover:text-purple-300 transition-colors duration-200"
          aria-label="Cerrar modal"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="mt-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 -mr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb]:rounded">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
