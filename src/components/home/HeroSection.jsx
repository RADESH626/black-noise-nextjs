'use client';
import { motion } from 'framer-motion';
import BotonDescargar from '@/components/common/botones/BotonDescargar';

function HeroSection() {
  return (
    <motion.section
      className='flex flex-col justify-start items-start gap-5 px-90 py-16 text-white bg-gradient-hero'
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 5 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className='flex flex-col md:flex-row justify-center items-center gap-10 w-full'>

        {/* IZQUIERDA: CONTENIDO ORIGINAL */}
        <div className='flex flex-col justify-center items-center gap-8 px-10 py-16 text-white w-full md:w-1/2'>
          {/* TÍTULO */}
          <motion.h1
            className='font-bold text-5xl mb-4'
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Dale Forma a Tu Estilo
          </motion.h1>

          {/* DESCRIPCIÓN */}
          <motion.p
            className='text-lg mb-6'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Tu imaginación no tiene límites. Con BlackNoise Editor, crea prendas únicas que marcan tendencia.
          </motion.p>

          {/* CONTENEDOR DE LA IMAGEN CON ANIMACIÓN */}
          <div className='relative w-full max-w-4xl overflow-hidden rounded-[10px]'>
            {/* DESTELLO NEGRO */}
            <motion.div
              className='absolute inset-0 bg-black z-20'
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              transition={{ delay: 0.4, duration: 0.45, ease: 'easeInOut' }}
              style={{ originX: 0 }}
              viewport={{ once: true }}
            />

            {/* IMAGEN */}
            <motion.img
              src="/img/Modelos/Modelo-Editor.jpg"
              alt="Editor"
              className='w-full h-auto rounded-[10px]'
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
            />
          </div>
        </div>

        {/* DERECHA: DESCRIPCIÓN ADICIONAL (solo visible en pantallas grandes) */}
        <motion.div
  className="w-full md:w-1/2 flex flex-col justify-center h-full p-6 text-white"
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
  viewport={{ once: true }}
>
  <h2 className="text-3xl font-bold mb-4">Diseña a tu manera</h2>
  <p className="text-lg mb-2">
    Transforma tu imaginación en realidad. Diseña prendas únicas modificando colores, cortes, estampados y más.
  </p>
  <p className="text-lg">
    Todo se muestra en tiempo real, con una experiencia <strong>moderna, fluida y fresca</strong>, pensada para creadores auténticos.
  </p>
</motion.div>

      </div>

      

      {/* BOTÓN "Descárgalo ahora" */}
      <div className='self-center mt-8'>
        <BotonDescargar onClick={() => window.location.href = 'https://github.com/Cryxxis/EditorBN/tree/master'}>¡Descárgalo ahora!</BotonDescargar>
      </div>
    </motion.section>
  );
}

export default HeroSection;
