"use client";

import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import Link from 'next/link';
import Image from 'next/image';

// Add an isOpen prop to control the dialog visibility
const CartModal = ({ cartItems, onClose, isOpen }) => {
  const dialogRef = useRef(null); // Ref for the dialog element

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); // Show the dialog
    } else {
      dialogRef.current?.close(); // Close the dialog
    }
  }, [isOpen]); // Depend on isOpen to trigger dialog open/close

  return (
    // Use <dialog> element
    <dialog ref={dialogRef} className="relative p-8 rounded-lg shadow-lg max-w-xs w-full max-h-96 overflow-y-auto" style={{ backgroundColor: "#FFFFFF", margin: "auto" }}>
      <div className="flex justify-between items-center mb-4 px-4 pt-2">
        <h2 className="text-xl font-bold">Tu Carrito</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <Image src="/icons/icono-x.svg" alt="Cerrar" width={24} height={24} />
        </button>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <>
          <ul className="px-4">
            {cartItems.map((item) => (
              <li key={item.designId} className="flex items-center mb-4 border-b pb-4">
                <Image
                  src={item.imageData ? `data:${item.imageMimeType};base64,${item.imageData}` : '/img/placeholder.jpg'}
                  alt={item.nombre}
                  width={60}
                  height={60}
                  className="rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.nombre}</h3>
                  <p className="text-sm text-gray-600">Precio: ${item.price}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 px-4 pb-2">
            <Link href="/carrito">
              <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                Ir al Carrito
              </button>
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8 px-4 pb-2">Tu carrito está vacío.</p>
      )}
    </dialog>
  );
};

export default CartModal;
