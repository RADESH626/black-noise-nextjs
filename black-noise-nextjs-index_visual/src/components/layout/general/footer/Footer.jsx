import MetodosDePagoFooter from "./footerComponents/MetodosDePagoFooter";
import AyudaFooter from "./footerComponents/AyudaFooter";
import ContactosFooter from "./footerComponents/ContactosFooter";
import RedesSocialesFooter from "./footerComponents/RedesSocialesFooter";

function Footer() {
  return (
    <footer className="bg-black text-white flex flex-row justify-between p-6">
        <MetodosDePagoFooter />
        <AyudaFooter/>
        <ContactosFooter/>
        <RedesSocialesFooter />
    </footer>
  );
}

export default Footer;