"use client";

import React, { useRef } from 'react'; // Import useRef
import Link from 'next/link';
import Image from 'next/image';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

// Add an isOpen prop to control the dialog visibility
const CartModal = ({ cartItems, onClose, isOpen, onRemoveItem }) => {
  const dialogRef = useRef(null); // Ref for the div element, though not strictly needed for visibility control

  if (!isOpen) return null; // Render nothing if not open

  return (
    <div ref={dialogRef} className="absolute right-0 mt-2 p-4 rounded-lg shadow-lg max-w-xs w-80 max-h-96 overflow-y-auto z-50" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="flex justify-between items-center mb-4 px-4 pt-2">
        <h2 className="text-xl font-bold">Tu Carrito</h2>
        <BotonGeneral onClick={onClose} variant="secondary" className="text-gray-500 hover:text-gray-700">
          <Image src="/icons/icono-x.svg" alt="Cerrar" width={24} height={24} />
        </BotonGeneral>
      </div>

      <div className="mt-4 px-4 pb-2">
        <Link href="/carrito">
          <BotonGeneral variant="secondary" className="w-full py-2">
            Ir al Carrito
          </BotonGeneral>
        </Link>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <>
          <ul className="p-4 ">
            {cartItems.map((item) => (
              <li key={item.designId} className="flex items-center  gap-4 justify-between">

                <div className="flex items-center gap-4">

                  <Image
                    src={item.imageData ? `data:${item.imageMimeType};base64,${item.imageData}` : '/img/placeholder.jpg'}
                    alt={item.nombre}
                    width={60}
                    height={60}
                    className=""
                  />

                  <div className="gap-2">
                    <h3 className="font-semibold">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">Precio: ${item.price}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>

                </div>


                <BotonGeneral
                  onClick={() => onRemoveItem(item.designId)}
                  variant="danger"
                  className="p-1 rounded-full flex items-center justify-center"
                >
                  <Image src="/icons/icono-basurero.svg" alt="Eliminar" width={24} height={24} />
                </BotonGeneral>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8 px-4 pb-2">Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartModal;
