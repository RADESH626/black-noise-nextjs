"use client";

import React from 'react';
import CartComponent from '@/components/common/CartComponent'; // Import the existing CartComponent
<<<<<<< HEAD
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal'; // Import HeaderPrincipal

function CarritoPage() {
  return (
    <>
      <HeaderPrincipal hideCartIcon={true} showBackButton={true} backButtonHref="/catalogo" />
      <CartComponent className="h-screen" />
    </>
=======

function CarritoPage() {
  return (
      <CartComponent className="h-screen" />
>>>>>>> db35ad5 (diseños login y registro)
  );
}

export default CarritoPage;
