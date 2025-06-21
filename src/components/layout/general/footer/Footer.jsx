import MetodosDePagoFooter from "./footerComponents/MetodosDePagoFooter";
import AyudaFooter from "./footerComponents/AyudaFooter";
import ContactosFooter from "./footerComponents/ContactosFooter";
import RedesSocialesFooter from "./footerComponents/RedesSocialesFooter";

function Footer() {
  return (
<<<<<<< HEAD
    <footer className="bg-black text-white flex flex-row gap-100">
        <MetodosDePagoFooter/>
        <AyudaFooter/>
        <ContactosFooter/>
        <RedesSocialesFooter/>
=======
    <footer className="bg-black text-white flex justify-between items-end px-10 py-8">
      
      <div className="flex flex-row gap-20 items-start">
        <ContactosFooter />
      </div>

      {/* Sección izquierda horizontal */}
      <div className="flex flex-row gap-20 items-start">
        <AyudaFooter />
      </div>

      {/* Métodos de pago a la derecha, abajo */}
      <div className="flex flex-col self-center">
        <MetodosDePagoFooter />
      </div>

      {/* Redes Sociales subidas hacia la mitad */}
      <div className="flex flex-col self-center">
          <RedesSocialesFooter />
      </div>
>>>>>>> db35ad5 (diseños login y registro)
    </footer>
  );
}

export default Footer;
