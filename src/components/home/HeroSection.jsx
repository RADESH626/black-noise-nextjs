'use client'
import { motion } from 'framer-motion';
import BotonDescargar from '@/components/common/botones/BotonDescargar';

function HeroSection() {
  return (
    <motion.section
      className='flex flex-col justify-start items-start gap-5 px-90 py-16 text-white'
      style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 5 }}
      transition={{ duration: 1.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className='flex flex-col justify-center items-center gap-8 px-10 py-16 text-white'>
        <motion.h1
          className='font-bold text-5xl mb-4'
          style={{ color: '#ffffff' }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 5 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false }}
        >
          Dale Forma a Tu Estilo
        </motion.h1>

        <motion.p
          className='text-lg mb-6'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          viewport={{ once: false }}
        >
          Tu imaginación no tiene límites. Con BlackNoise Editor, crea prendas únicas que marcan tendencia.
        </motion.p>

        <motion.img
          src="/img/modelos/Modelo Editor.jpg"
          alt="Editor"
          className='rounded-[10px] h-full w-full'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          viewport={{ once: false }}
        />
      </div>

      <div className='self-center'>
        <BotonDescargar>!Descargalo ahora!</BotonDescargar>
      </div>
    </motion.section>
  );
}

export default HeroSection;
