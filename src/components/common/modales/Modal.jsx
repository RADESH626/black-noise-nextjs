"use client";

import React, { useEffect, useRef } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

const Modal = ({ title, children, onClose, isOpen, type = 'default', onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', showActions = false, onOpened }) => {
  const dialogRef = useRef(null);

  const modalClasses = {
    default: "bg-gray-800 text-white",
    info: "bg-blue-800 text-white",
    success: "bg-green-800 text-white",
    error: "bg-red-800 text-white",
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dialogRef.current && onOpened) {
      onOpened();
    }
  }, [isOpen, onOpened]);

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 flex items-center justify-center z-[9999] bg-transparent h-screen w-screen border-none outline-none`}
    >
      <div className={`relative p-6 rounded-lg shadow-xl max-w-2xl w-11/12 md:w-2/3 lg:w-1/2 bg-white text-black max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">{title}</h2>
        <div className="modal-content relative z-10"> {/* Añadido relative z-10 */}
          {children}
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl leading-none"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        {showActions && (
          <div className="mt-6 flex justify-end space-x-4">
            <BotonGeneral
              onClick={onCancel}
              variant="secondary"
              className="px-4 py-2"
            >
              {cancelText}
            </BotonGeneral>
            <BotonGeneral
              onClick={onConfirm}
              variant="primary"
              className="px-4 py-2"
            >
              {confirmText}
            </BotonGeneral>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
