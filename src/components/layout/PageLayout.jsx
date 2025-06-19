import React from 'react';
import HeaderPrincipal from './general/HeaderPrincipal';
import Footer from './general/footer/Footer';

export default function PageLayout({ children }) {
  return (
    <>
      <HeaderPrincipal />
      {children}
      <Footer />
    </>
  );
}
