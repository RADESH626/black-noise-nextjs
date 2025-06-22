import MetodosDePagoFooter from "./footerComponents/MetodosDePagoFooter";
import AyudaFooter from "./footerComponents/AyudaFooter";
import ContactosFooter from "./footerComponents/ContactosFooter";
import RedesSocialesFooter from "./footerComponents/RedesSocialesFooter";
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-12 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetodosDePagoFooter />
          <AyudaFooter />
          <ContactosFooter />
          <RedesSocialesFooter />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Black Noise. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
