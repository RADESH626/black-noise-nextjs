import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CartModal = ({ cartItems, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50" onClick={onClose}>
      <div
        className="bg-white w-80 h-full shadow-lg p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Image src="/icons/icono-x.svg" alt="Cerrar" width={24} height={24} />
          </button>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.designId} className="flex items-center mb-4 border-b pb-4">
                  <Image
                    src={item.imageUrl || '/img/placeholder.jpg'} // Assuming item has imageUrl
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Precio: ${item.price}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/carrito">
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                  Ir al Carrito
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-8">Tu carrito está vacío.</p>
        )}
      </div>
    </div>
  );
};

export default CartModal;
