'use client'
import { motion } from 'framer-motion';

function GarmentTypesSection() {
  const garmentTypes = [
    { src: '../IMG/Sweaters/Sweater 1.jpg', alt: 'Sweater 2', label: 'Sweater' },
    { src: '../IMG/Hoddie_s/Hoddie 1.jpg', alt: 'Hoddie 1', label: "Hoddie's" },
    { src: '../IMG/Camisas/Camisa 1.jpg', alt: 'Camisa 1', label: 'Camisas' },
    { src: '../IMG/Pantalones/Pantalon 2.jpg', alt: 'Pantalón 2', label: 'Pantalones' },
  ];

  return (
    <motion.section
      className='flex flex-wrap justify-center items-center gap-10  p-10 text-[#bdb0ba]'
      style={{ background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: false }}
    >
      {garmentTypes.map((item, index) => (
        <motion.div
          key={index}
          className='w-105 rounded overflow-hidden shadow-lg bg-gray-800'
          initial={{ opacity: 0, scale: 0.30 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.30, delay: index * 0.80 }}
          viewport={{ once: false }}
        >
          <img src={item.src} alt={item.alt} className='w-full h-80 object-cover rounded-t' />
          <div className='p-4 text-center'>
            <h2 className='text-xl font-semibold'>{item.label}</h2>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}

export default GarmentTypesSection;
