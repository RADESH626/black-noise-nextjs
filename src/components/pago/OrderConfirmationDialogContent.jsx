"use client";

import React from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import BotonGeneral from '@/components/common/botones/BotonGeneral';
=======
>>>>>>> db35ad5 (diseños login y registro)

function OrderConfirmationDialogContent({ pedidoId, onClose }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">¡Pedido Registrado Correctamente!</h2>
      <p className="text-gray-700 mb-4">Tu pedido ha sido procesado exitosamente.</p>
      {pedidoId && (
        <p className="text-gray-700 mb-4">
          Número de Pedido: <span className="font-semibold">{pedidoId}</span>
        </p>
      )}
      <p className="text-gray-700 mb-6">Recibirás un correo de confirmación con los detalles de tu pedido.</p>
      <div className="flex flex-col space-y-3">
        <Link href="/catalogo" passHref>
<<<<<<< HEAD
          <BotonGeneral
            onClick={onClose}
            variant="secondary"
            className="w-full py-3"
          >
            Continuar Comprando
          </BotonGeneral>
        </Link>
        <Link href="/perfil/mis-pedidos" passHref>
          <BotonGeneral
            onClick={onClose}
            variant="info"
            className="w-full py-3"
          >
            Ver Mis Pedidos
          </BotonGeneral>
=======
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
          >
            Continuar Comprando
          </button>
        </Link>
        <Link href="/perfil/mis-pedidos" passHref>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 font-semibold py-3 rounded hover:bg-gray-400 transition"
          >
            Ver Mis Pedidos
          </button>
>>>>>>> db35ad5 (diseños login y registro)
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationDialogContent;
