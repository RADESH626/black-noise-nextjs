'use client'
import { useState, useEffect } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import GarmentTypesSection from '@/components/home/GarmentTypesSection';
import Loader from '@/components/Loader';

function IndexPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    if(document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      
       <HeaderPrincipal /> 
      <main className={`flex-grow ${isLoading ? 'hidden' : 'block'}`}>
        <HeroSection />
        
        <FeatureSection
          imgSrc='/img/Modelos/Modelo 4.jpg'
          title={['DISEÑA', 'PRENDAS REALES']}
          description='Selecciona tu talla, el color, corta y crea detalles'
        />
        
        <FeatureSection
          imgSrc='/img/Modelos/Modelo 3.jpg'
          title={['AÑADE ELEMENTOS', 'A TUS PRENDAS']}
          description='Añade parches, taches, estampados y mucho más'
          imageLeft={true}
          accentWordIndex={0}
        />
        
        <GarmentTypesSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default IndexPage;
