import Link from 'next/link';
import H3Footer from "@/components/common/textos/H/H3Footer";



function AyudaFooter() {
  return (
    <nav aria-label="Ayuda y enlaces legales" className="flex flex-col space-y-2">
      <H3Footer>
        Ayuda
      </H3Footer>
      <Link href="/terminos" className="link-footer">
        Términos y condiciones
      </Link>
      <Link href="/politica-privacidad" className="link-footer">
        Política de privacidad
      </Link>
      <Link href="/politica-compra" className="link-footer">
        Política de compra
      </Link>
    </nav>
  )
}

export default AyudaFooter;