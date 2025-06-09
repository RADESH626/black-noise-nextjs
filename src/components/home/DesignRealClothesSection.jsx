'use client'
import { motion } from 'framer-motion';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function DesignRealClothesSection({ imgSrc, title, description, imageLeft = false }) {
  return (
    <motion.section
      className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full'
      style={{ background: 'linear-gradient(to bottom, #000000, #1f2937)' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className={`flex flex-col md:flex-row ${imageLeft ? 'md:flex-row-reverse' : ''} justify-between items-center gap-4 w-full max-w-7xl`}>
        <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
          <h1 className='font-bold text-5xl w-full'>{title[0]}</h1>
          <h1 className='font-bold text-5xl w-full'>{title[1]}</h1>
          <p className='text-4xl'>{description}</p>
          <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
        </div>

        <motion.div
          className='flex justify-center items-center p-5 w-full md:w-1/2'
          initial={{ scale: 0.9, opacity: 0 }}
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
      </div>
    </motion.section>
  );
}

export default DesignRealClothesSection;
