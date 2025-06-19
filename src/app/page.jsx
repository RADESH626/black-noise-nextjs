'use client'
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import HeroSection from '@/components/home/HeroSection';
import DesignRealClothesSection from '@/components/home/DesignRealClothesSection';
import AddElementsSection from '@/components/home/AddElementsSection';
import GarmentTypesSection from '@/components/home/GarmentTypesSection';


function indexPage() {
  return (
    <div className='pt-16'>
      <HeaderPrincipal />

      <main className="flex flex-col justify-between h-full">

        <HeroSection />

        <DesignRealClothesSection
          imgSrc='/img/Modelos/Modelo 4.jpg'
          title={['DISEÑA', 'PRENDAS REALES']}
          description='Selecciona tu talla, el color, corta y crea detalles'
        />

        <AddElementsSection
          imgSrc='/img/Modelos/Modelo 3.jpg'
          title={['AÑADE ELEMENTOS', 'A TUS PRENDAS']}
          description='Añade parches, taches, estampados y mucho más'
        />

        <DesignRealClothesSection
          imgSrc='/img/Modelos/Modelo 5.jpg'
          title={['DISEÑA', 'PRENDAS REALES']}
          description='Selecciona tu talla, el color, corta y crea detalles'
          imageLeft={true}
        />

        <GarmentTypesSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}

export default indexPage;
