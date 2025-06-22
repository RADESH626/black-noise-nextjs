import Link from 'next/link';
import H3Footer from "@/components/common/textos/H/H3Footer";

function MetodosDePagoFooter() {
  return (
<div className='flex flex-col'>
  <div className="flex flex-row gap-4 items-center">
    <a href="" target="" rel=" ">
      <img src="/img/logos/Logo Visa.jpg" alt="Visa" className="h-8 cursor-pointer" />
    </a>
     <a href="" target="" rel=" ">
      <img src="/img/logos/Logo Aexpress.jpg" alt="American Express" className="h-8 cursor-pointer" />
    </a>
    <a href="" target="" rel=" ">
      <img src="/img/logos/Logo Mastercard.jpg" alt="MasterCard" className="h-8 cursor-pointer" />
    </a>
    <a href="" target="" rel=" ">
      <img src="/img/logos/Logo Paypal.jpg" alt="PayPal" className="h-8 cursor-pointer" />
    </a>    
  </div>
  </div>
  )
}

export default MetodosDePagoFooter;