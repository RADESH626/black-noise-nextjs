'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/layout/general/footer/Footer';

const DynamicFooter = dynamic(() => import('@/components/layout/general/footer/Footer'), {
  ssr: false,
});

export default function DynamicFooterWrapper() {
  return <DynamicFooter />;
}
