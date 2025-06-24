import H3Footer from "@/components/common/textos/H/H3Footer";
import { motion } from 'framer-motion';

function ContactosFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <H3Footer>
        Contactos
      </H3Footer>
      <div className="mt-4 flex flex-col space-y-3 text-gray-300">
        <p>
          Email: <a 
            href="mailto:blacknoisecompany@gmail.com" 
            className="hover:text-white transition-colors duration-300"
          >
            blacknoisecompany@gmail.com
          </a>
        </p>
        <p>
          Teléfono: <a 
            href="tel:+3124522599" 
            className="hover:text-white transition-colors duration-300"
          >
            +3124522599
          </a>
        </p>
      </div>
    </motion.div>
  )
}

export default ContactosFooter;