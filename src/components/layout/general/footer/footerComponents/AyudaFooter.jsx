import Link from 'next/link';
import H3Footer from "@/components/common/textos/H/H3Footer";
import { motion } from 'framer-motion';

function AyudaFooter() {
  const links = [
    { href: "/terminos", text: "Términos y condiciones" },
    { href: "/politica-privacidad", text: "Política de privacidad" },
    { href: "/politica-compra", text: "Política de compra" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <H3Footer>
        Ayuda
      </H3Footer>
      <nav aria-label="Ayuda y enlaces legales" className="mt-4 flex flex-col space-y-3">
        {links.map((link, index) => (
          <Link 
            key={index} 
            href={link.href}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            {link.text}
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}

export default AyudaFooter;
