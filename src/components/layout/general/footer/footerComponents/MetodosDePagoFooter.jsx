import Link from 'next/link';
import H3Footer from "@/components/common/textos/H/H3Footer";

function MetodosDePagoFooter() {
  return (
<div className='flex flex-col'>
  <H3Footer>
    Metodos de pago
  </H3Footer>

  <div className="flex flex-row gap-4 items-center">
      <img src="/img/logos/Logo Visa.jpg" alt="Visa" className="h-8 cursor-pointer" />
    <p>Visa</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
      <img src="/img/logos/Logo Mastercard.jpg" alt="MasterCard" className="h-8 cursor-pointer" />
    <p>Mastercard</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
      <img src="/img/logos/Logo Paypal.jpg" alt="PayPal" className="h-8 cursor-pointer" />
    <p>Paypal</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
      <img src="/img/logos/Logo Aexpress.jpg" alt="American Express" className="h-8 cursor-pointer" />
    <p>American Express</p>
  </div>
</div>

  )
}

export default MetodosDePagoFooter;