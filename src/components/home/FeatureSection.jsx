'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

function FeatureSection({ 
  imgSrc, 
  title, 
  description, 
  imageLeft = false,
  accentWordIndex = 1
}) {
  return (
    <motion.section
      className='py-16 px-4 md:px-10 text-black w-full bg-white'
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
    >
      <div className={`max-w-7xl mx-auto flex flex-col ${imageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16`}>
        {/* Contenedor de imagen */}
        <motion.div
          className='w-full md:w-1/2 aspect-square relative'
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: imageLeft ? 0 : 0.3 }}
          viewport={{ once: true }}
        >
          <Image
            src={imgSrc}
            alt={title.join(' ') + " - " + description}
            fill
            className='rounded-3xl md:rounded-[80px] object-cover shadow-2xl'
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={true}
          />
        </motion.div>

        {/* Contenedor de texto con tamaño aumentado */}
        <div className='w-full md:w-1/2 flex flex-col justify-center'>
          <motion.h2
            className='font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {title.map((word, index) => (
              <span key={index}>
                {index === accentWordIndex ? (
                  <span className='text-blue-600'>{word}</span>
                ) : (
                  <span className='text-gray-900'>{word}</span>
                )}
                <br />
              </span>
            ))}
          </motion.h2>
          
          <motion.p
            className='text-2xl md:text-3xl mb-8 text-gray-700'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Botón azul con mismo estilo que "Ver Demostración Completa" */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto">
              EMPIEZA AHORA
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default FeatureSection;