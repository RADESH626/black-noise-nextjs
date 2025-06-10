"use client";

import React from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
  return (
    <div key={item.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-gray-400">Precio: ${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="0"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
          className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <BotonGeneral onClick={() => onRemoveItem(item.id)}>
          Eliminar
        </BotonGeneral>
      </div>
    </div>
  );
}

export default CartItem;
