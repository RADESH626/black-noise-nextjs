'use client'
import { motion } from 'framer-motion';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function AddElementsSection({ imgSrc, title, description }) {
  return (
    <motion.section
      className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full'
      style={{ background: 'linear-gradient(to bottom, #1f2937, #000000)' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: false }}
    >
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl'>
        <motion.div
          className='flex justify-center items-center p-5 w-full md:w-1/2'
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false }}
        >
          <img
            src={imgSrc}
            alt="imagen de ropa"
            className='rounded-[80px] w-full h-auto object-cover'
          />
        </motion.div>

        <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
          <h1 className='font-bold text-5xl w-full'>{title[0]}</h1>
          <h1 className='font-bold text-5xl w-full'>{title[1]}</h1>
          <p className='text-4xl'>{description}</p>
          <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
        </div>
      </div>
    </motion.section>
  );
}

export default AddElementsSection;
