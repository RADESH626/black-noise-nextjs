'use client'
import { motion } from 'framer-motion';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function AddElementsSection({ imgSrc, title, description }) {
  return (
    <motion.section
      className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full bg-gradient-section'
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl'>
        {/* Imagen animada */}
        <motion.div
          className='flex justify-center items-center p-5 w-full md:w-1/2'
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={imgSrc}
            alt="imagen de ropa"
            className='rounded-[80px] w-full h-auto object-cover shadow-2xl'
          />
        </motion.div>

        {/* Texto animado en cascada */}
        <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
          <motion.h1
            className='font-bold text-5xl w-full'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {title[0]}
          </motion.h1>

          <motion.h1
            className='font-bold text-5xl w-full'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {title[1]}
          </motion.h1>

          <motion.p
            className='text-4xl'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default AddElementsSection;
