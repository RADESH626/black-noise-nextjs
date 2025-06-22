'use client';

import React from 'react';
import HeaderPrincipal from './general/HeaderPrincipal';
import dynamic from 'next/dynamic';
import Footer from './general/footer/Footer';

const DynamicFooter = dynamic(() => import('./general/footer/Footer'), {
  ssr: false,
});

export default function PageLayout({ children }) {
  return (
    <>
      <HeaderPrincipal />
      {children}
      <DynamicFooter />
    </>
  );
}
