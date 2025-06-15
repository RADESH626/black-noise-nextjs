'use client'
import { motion } from 'framer-motion';

function GarmentTypesSection() {
  const garmentTypes = [
    { src: '../IMG/Sweaters/Sweater 1.jpg', alt: 'Sweater 1', label: 'Sweater' },
    { src: '../IMG/Hoddie_s/Hoddie 1.jpg', alt: 'Hoddie 1', label: "Hoddie's" },
    { src: '../IMG/Camisas/Camisa 1.jpg', alt: 'Camisa 1', label: 'Camisas' },
    { src: '../IMG/Pantalones/Pantalon 2.jpg', alt: 'Pantalón 2', label: 'Pantalones' },
  ];

  return (
    <motion.section
      className='flex flex-wrap justify-center items-center gap-10 p-10 text-white w-full'
      style={{ background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {garmentTypes.map((item, index) => (
        <motion.div
          key={index}
          className='w-72 rounded-xl overflow-hidden bg-gray-800 shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105'
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <img
            src={item.src}
            alt={item.alt}
            className='w-full h-80 object-cover rounded-t-xl'
          />
          <div className='p-4 text-center'>
            <h2 className='text-xl font-semibold text-white'>{item.label}</h2>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}

export default GarmentTypesSection;
