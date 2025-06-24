import H3Footer from "@/components/common/textos/H/H3Footer";
import { motion } from 'framer-motion';

function RedesSocialesFooter() {
  const redes = [
    { name: "Facebook", logo: "/icons/icono-facebook-nuevo.svg", url: "https://www.facebook.com/" },
    { name: "Instagram", logo: "/icons/icono-logo-de-instagram.svg", url: "https://www.instagram.com/black_noise222?igsh=MWNpcTZ4aTc2NGh3Yg==" },
    { name: "X", logo: "/icons/icono-x.svg", url: "https://x.com/?lang=es" },
    { name: "Youtube", logo: "/icons/icono-youtube-play.svg", url: "https://youtube.com/@blacknoise222?si=KNs_M8N9eHNnLn2Z" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <H3Footer>
        Redes sociales
      </H3Footer>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {redes.map((red, index) => (
          <a 
            key={index} 
            href={red.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="bg-black p-1 rounded-full">
              <img 
                src={red.logo} 
                alt={red.name} 
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
              {red.name}
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  )
}

export default RedesSocialesFooter;