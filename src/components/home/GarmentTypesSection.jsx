'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

function GarmentTypesSection() {
  const garmentTypes = [
    { src: '/img/Sweaters/Sweater 1.jpg', alt: 'Sweater negro con diseño', label: 'Sweaters' },
    { src: '/img/Hoddie_s/Hoddie 1.jpg', alt: 'Hoodie gris con capucha', label: "Hoodies" },
    { src: '/img/Camisas/Camisa 1.jpg', alt: 'Camisa denim azul', label: 'Camisas' },
    { src: '/img/Pantalones/Pantalon 2.jpg', alt: 'Pantalón cargo beige', label: 'Pantalones' },
  ];

  return (
    <motion.section
      // Cambiamos a fondo blanco y texto negro
      className='py-16 px-4 bg-white text-black'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          EXPLORA NUESTRAS PRENDAS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {garmentTypes.map((item, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className='relative h-80'>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className='object-cover'
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className='p-4 text-center'>
                <h2 className='text-xl font-semibold text-gray-900'>{item.label}</h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default GarmentTypesSection;