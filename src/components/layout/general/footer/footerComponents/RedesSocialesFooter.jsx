import Link from 'next/link';
import H3Footer from "@/components/common/textos/H/H3Footer";

function RedesSocialesFooter() {
  return (
    <div className='flex flex-col'>

      <div className="flex flex-row gap-4 items-center">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <img src="/icons/icono-facebook-nuevo.svg" alt="Facebook" className="h-8 cursor-pointer" />
        </a>
        <a href="https://www.instagram.com/black_noise222?igsh=MWNpcTZ4aTc2NGh3Yg==" target="_blank" rel="noopener noreferrer">
          <img src="/icons/icono-logo-de-instagram.svg" alt="Instagram" className="h-8 cursor-pointer" />
        </a>
         <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
          <img src="/icons/icono-x.svg" alt="X" className="h-8 cursor-pointer" />
        </a>
        <a href="https://youtube.com/@blacknoise222?si=KNs_M8N9eHNnLn2Z" target="_blank" rel="noopener noreferrer">
          <img src="/icons/icono-youtube-play.svg" alt="Youtube" className="h-8 cursor-pointer" />
        </a>
      </div>
    </div>
  )
}

export default RedesSocialesFooter;
