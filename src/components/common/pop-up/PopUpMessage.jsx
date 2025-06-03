import React, { useEffect, useState } from 'react';

const PopUpMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 1500); // Auto-hide after 1.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const popupClass = type === 'success' ? 'popup-success' : 'popup-error';

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50 animate-slideDown">
      <div className={`${popupClass} text-secondary px-6 py-4 rounded-b-lg popup-shadow min-w-[300px] max-w-[500px] mx-4 mt-0 backdrop-blur-sm bg-opacity-95`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl ${type === 'success' ? 'text-neutral-100' : 'text-neutral-100'}`}>
              {type === 'success' ? '✓' : '✕'}
            </span>
            <p className="font-medium text-lg">{message}</p>
          </div>
          <button 
            onClick={() => { setIsVisible(false); onClose(); }} 
            className="ml-4 text-secondary hover:text-neutral-300 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpMessage;
