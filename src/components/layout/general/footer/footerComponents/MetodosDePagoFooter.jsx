<<<<<<< HEAD
import Link from 'next/link';
=======
>>>>>>> db35ad5 (diseños login y registro)
import H3Footer from "@/components/common/textos/H/H3Footer";

function MetodosDePagoFooter() {
  return (
<<<<<<< HEAD
<div className='flex flex-col'>
  <H3Footer>
    Metodos de pago
  </H3Footer>

  <div className="flex flex-row gap-4 items-center">
    <a href="https://www.visa.com/" target="_blank" rel="noopener noreferrer">
      <img src="/img/logos/Logo Visa.jpg" alt="Visa" className="h-8 cursor-pointer" />
    </a>
    <p>Visa</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
    <a href="https://www.mastercard.com/" target="_blank" rel="noopener noreferrer">
      <img src="/img/logos/Logo Mastercard.jpg" alt="MasterCard" className="h-8 cursor-pointer" />
    </a>
    <p>Mastercard</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
    <a href="https://www.paypal.com/" target="_blank" rel="noopener noreferrer">
      <img src="/img/logos/Logo Paypal.jpg" alt="PayPal" className="h-8 cursor-pointer" />
    </a>
    <p>Paypal</p>
  </div>

  <div className="flex flex-row gap-4 items-center">
    <a href="https://www.americanexpress.com/" target="_blank" rel="noopener noreferrer">
      <img src="/img/logos/Logo Aexpress.jpg" alt="American Express" className="h-8 cursor-pointer" />
    </a>
    <p>American Express</p>
  </div>
</div>

  )
=======
    <div className='flex flex-col items-end gap-4'>
      <div className="flex flex-row gap-4 items-center">
          <img src="/img/logos/Logo Aexpress.jpg" alt="American Express" className="h-8 w-auto cursor-pointer" />
          <img src="/img/logos/Logo Mastercard.jpg" alt="MasterCard" className="h-8 w-auto cursor-pointer" />
          <img src="/img/logos/Logo Paypal.jpg" alt="PayPal" className="h-8 w-auto cursor-pointer" />
          <img src="/img/logos/Logo Visa.jpg" alt="Visa" className="h-8 w-auto cursor-pointer" />
      </div>
    </div>
  );
>>>>>>> db35ad5 (diseños login y registro)
}

export default MetodosDePagoFooter;
