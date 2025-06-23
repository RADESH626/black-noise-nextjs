"use client";

import React, { memo } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

const CartItem = memo(({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div key={item.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center"> 
        {item.image && (
          <img src={item.image} alt={item.nombre || 'Design Image'} className="w-16 h-16 object-cover rounded-md mr-4" />
        )}
        <div className="flex-grow"> {/* Added flex-grow to ensure content takes available space */}
          <h3 className="text-lg font-semibold text-white">{item.nombre}</h3>
          <p className="text-gray-400">Precio unitario: ${(item.price ?? 0).toFixed(2)}</p>
          <p className="text-gray-400 font-bold">Subtotal: ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
          {item.descripcion && <p className="text-gray-400 text-sm">Descripción: {item.descripcion}</p>}
          {item.categoria && <p className="text-gray-400 text-sm">Categoría: {item.categoria}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="1"
          maxLength={4}
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, e.target.value)}
          className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <BotonGeneral onClick={() => onRemoveItem(item.id)} className="bg-gray-500 hover:bg-gray-600 text-white">
          Eliminar
        </BotonGeneral>
      </div>
    </div>
  );
}); // Corrected closing for memo

export default CartItem;
