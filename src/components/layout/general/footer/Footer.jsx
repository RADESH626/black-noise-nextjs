import MetodosDePagoFooter from "./footerComponents/MetodosDePagoFooter";
import AyudaFooter from "./footerComponents/AyudaFooter";
import ContactosFooter from "./footerComponents/ContactosFooter";
import RedesSocialesFooter from "./footerComponents/RedesSocialesFooter";

function Footer() {
  return (
    <footer className="bg-black text-white flex justify-between items-end px-10 py-8">
      
      <div className="flex flex-row gap-30 items-start relative -top-8">
        <ContactosFooter />
      </div>

      <div className="flex flex-row gap-30 items-start relative -top-6">
        <AyudaFooter />
      </div>

      {/* Redes Sociales subidas hacia la mitad */}
      <div className="flex flex-col items-end justify-end -translate-y-16">
        <RedesSocialesFooter />
      </div>

      <div className="flex flex-col items-end justify-end -translate-y-16">
        <MetodosDePagoFooter />
      </div>
    </footer>
  );
}

export default Footer;
