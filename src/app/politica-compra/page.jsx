"use client";
import React from 'react';
import Footer from '@/components/layout/general/footer/Footer';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';

export default function PoliticaCompraPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#ffffff] text-[#000000]">
      
      {/* Header agregado */}
      <HeaderPrincipal />

      <div className="max-w-4xl mx-auto bg-[#FFFFFFFF]/70 p-8 rounded-lg shadow-lg mt-40 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#000000]">Política de Compra</h1>

        <p className="mb-4">
          En <strong>Black Noise</strong>, queremos que tu experiencia de compra sea clara y satisfactoria. A continuación, detallamos los términos y condiciones aplicables a las compras realizadas en nuestro sitio web.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">1. Proceso de Compra</h2>
        <p className="mb-4">
          Al realizar una compra, aceptas proporcionar información veraz y completa. Nos reservamos el derecho de cancelar o rechazar cualquier pedido que no cumpla con nuestros términos.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">2. Métodos de Pago</h2>
        <p className="mb-4">
          Aceptamos diversos métodos de pago seguros. El pago debe completarse antes de que el pedido sea procesado y enviado.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">3. Envíos y Entregas</h2>
        <p className="mb-4">
          Los tiempos de envío pueden variar según la ubicación y el método elegido. No nos hacemos responsables por retrasos causados por terceros.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">4. Cambios y Devoluciones</h2>
        <p className="mb-4">
          Aceptamos devoluciones y cambios conforme a las políticas establecidas en nuestro sitio. Por favor, revisa las condiciones específicas para cada caso.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">5. Cancelaciones</h2>
        <p className="mb-4">
          Las cancelaciones solo son posibles antes de que el pedido haya sido procesado para envío. Contacta con nuestro soporte lo antes posible si deseas cancelar.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">6. Contacto</h2>
        <p className="mb-4">
          Para cualquier duda o consulta relacionada con tu compra, puedes contactarnos a través de nuestros canales de atención.
        </p>
      </div>

      <Footer />
    </main>
  );
}