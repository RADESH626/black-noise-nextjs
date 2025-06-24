"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import PopUpMessage from '../components/common/modales/PopUpMessage';
import Modal from '../components/common/modales/Modal'; // Import the new Modal component

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success'); // 'success' or 'error'
  const [isPopUpPersistent, setIsPopUpPersistent] = useState(false); // New state for persistence

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('default');
  const [modalOnConfirm, setModalOnConfirm] = useState(null);
  const [modalOnCancel, setModalOnCancel] = useState(null);
  const [showModalActions, setShowModalActions] = useState(false);
  const [confirmText, setConfirmText] = useState('Confirmar');
  const [cancelText, setCancelText] = useState('Cancelar');
  const [modalOnOpenedCallback, setModalOnOpenedCallback] = useState(null); // Nuevo estado para el callback onOpened

  const showPopUp = useCallback((msg, msgType = 'success', persistent = false) => {
    console.log('DialogContext: showPopUp called with message:', msg, 'type:', msgType, 'persistent:', persistent);
    setMessage(msg);
    setType(msgType);
    setIsPopUpPersistent(persistent); // Set persistence
  }, []);

  const hidePopUp = useCallback(() => {
    setMessage(null);
    setIsPopUpPersistent(false); // Reset persistence when hiding
  }, []);

  const openModal = useCallback((title, content, type = 'default', onConfirm = null, onCancel = null, showActions = false, confirmBtnText = 'Confirmar', cancelBtnText = 'Cancelar', onOpenedCallback = null) => {
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setModalOnConfirm(() => onConfirm); // Wrap in a function to prevent direct execution
    setModalOnCancel(() => onCancel);   // Wrap in a function to prevent direct execution
    setShowModalActions(showActions);
    setConfirmText(confirmBtnText);
    setCancelText(cancelBtnText);
    setModalOnOpenedCallback(() => onOpenedCallback); // Guardar el callback
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle('');
    setModalType('default');
    setModalOnConfirm(null);
    setModalOnCancel(null);
    setShowModalActions(false);
    setConfirmText('Confirmar');
    setCancelText('Cancelar');
    setModalOnOpenedCallback(null); // Limpiar el callback
  }, []);

  const showConfirmDialog = useCallback((message, title = 'Confirmación', confirmBtnText = 'Confirmar', cancelBtnText = 'Cancelar') => {
    return new Promise((resolve) => {
      openModal(
        title,
        message,
        'default', // You can make this configurable if needed
        () => {
          closeModal();
          resolve(true);
        },
        () => {
          closeModal();
          resolve(false);
        },
        true, // showActions = true for confirm dialogs
        confirmBtnText,
        cancelBtnText
      );
    });
  }, [openModal, closeModal]);

  return (
    <DialogContext.Provider value={{ showPopUp, openModal, closeModal, showConfirmDialog }}>
      {children}
      {message && (
        <PopUpMessage
          message={message}
          type={type}
          onClose={hidePopUp}
          persistent={isPopUpPersistent} // Pass persistence to PopUpMessage
        />
      )}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          onClose={closeModal}
          isOpen={isModalOpen}
          type={modalType}
          onConfirm={modalOnConfirm}
          onCancel={modalOnCancel}
          showActions={showModalActions}
          confirmText={confirmText}
          cancelText={cancelText}
          onOpened={modalOnOpenedCallback} // Pasar el callback al Modal
        >
          {modalContent}
        </Modal>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
