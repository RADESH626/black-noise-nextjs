"use client";

import React from 'react';
import CartComponent from '@/components/common/CartComponent'; // Import the existing CartComponent

function CarritoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] flex items-center justify-center py-20">
      <CartComponent />
    </div>
  );
}

export default CarritoPage;
