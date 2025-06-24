"use client";
import React from 'react';
import Footer from '@/components/layout/general/footer/Footer';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal'; // Importación agregada

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffffff] via-[#fdfdfd] to-[#ffffff] text-[#000000] ">
      
      {/* Header agregado aquí */}
      <HeaderPrincipal />

      <div className="max-w-4xl mx-auto bg-[#FFFFFFFF]/70 p-8 rounded-lg shadow-lg mt-40 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#000000]">Política de Privacidad</h1>

        <p className="mb-4">
          En <strong>Black Noise</strong>, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestro sitio web.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">1. Información que recopilamos</h2>
        <p className="mb-4">
          Podemos recopilar información personal como nombre, correo electrónico, dirección y datos de pago cuando te registras o realizas una compra.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">2. Uso de la información</h2>
        <p className="mb-4">
          Utilizamos tus datos para procesar pedidos, mejorar nuestros servicios, enviarte notificaciones importantes y personalizar tu experiencia en nuestro sitio.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">3. Protección de datos</h2>
        <p className="mb-4">
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">4. Compartir información</h2>
        <p className="mb-4">
          No vendemos ni alquilamos tus datos personales. Solo compartimos información con terceros cuando es necesario para cumplir con pedidos o requerimientos legales.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">5. Tus derechos</h2>
        <p className="mb-4">
          Tienes derecho a acceder, corregir o eliminar tus datos personales. Para ejercer estos derechos, contáctanos a través de nuestros canales de soporte.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#000000]">6. Cambios en esta política</h2>
        <p className="mb-4">
          Podemos actualizar esta política periódicamente. Las modificaciones serán publicadas en esta página y entrarán en vigor inmediatamente después.
        </p>
      </div>

      <Footer />
    </main>
  );
}