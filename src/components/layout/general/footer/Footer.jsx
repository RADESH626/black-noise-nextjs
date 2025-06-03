import MetodosDePagoFooter from "./footerComponents/MetodosDePagoFooter";
import AyudaFooter from "./footerComponents/AyudaFooter";
import ContactosFooter from "./footerComponents/ContactosFooter";

function Footer() {
  return (
    <footer className="bg-black text-white flex flex-row justify-between">
        <MetodosDePagoFooter/>
        <AyudaFooter/>
        <ContactosFooter/>
    </footer>
  );
}

export default Footer;