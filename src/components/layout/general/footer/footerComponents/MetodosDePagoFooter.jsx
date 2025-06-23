import H3Footer from "@/components/common/textos/H/H3Footer";
import { motion } from 'framer-motion';

function MetodosDePagoFooter() {
  const metodos = [
    { name: "Visa", logo: "/img/logos/Logo Visa.jpg" },
    { name: "Mastercard", logo: "/img/logos/Logo Mastercard.jpg",  },
    { name: "Paypal", logo: "/img/logos/Logo Paypal.jpg",  },
    { name: "American Express", logo: "/img/logos/Logo Aexpress.jpg", }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <H3Footer>
        Métodos de pago
      </H3Footer>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {metodos.map((metodo, index) => (
          <a 
            key={index} 
            href={metodo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="bg-white p-1 rounded-md">
              <img 
                src={metodo.logo} 
                alt={metodo.name} 
                className="h-8 w-12 object-contain"
              />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
              {metodo.name}
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  )
}

export default MetodosDePagoFooter;