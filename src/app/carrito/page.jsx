"use client";

import React from 'react';
import CartComponent from '@/components/common/CartComponent'; // Import the existing CartComponent
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal'; // Import HeaderPrincipal

function CarritoPage() {
  return (
    <>
      <HeaderPrincipal hideCartIcon={true} showBackButton={true} backButtonHref="/catalogo" />
      <CartComponent className="h-screen" />
    </>
  );
}

export default CarritoPage;
