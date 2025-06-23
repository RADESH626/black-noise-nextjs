"use client";

import React from 'react';
import Link from 'next/link';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

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
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationDialogContent;
