"use client";

import { useModal } from "@/context/ModalContext";
import { signOut, useSession } from "next-auth/react";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import Link from "next/link"; // Import Link
import { useEffect, useState } from "react";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import { getCartByUserId, addDesignToCart } from "@/app/acciones/CartActions";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions";
import DesignsComponent from "../common/DesignsComponent";
import PedidosComponent from "../common/PedidosComponent";
import CartComponent from "../common/CartComponent";
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";
import FormEditarUsuario from "@/components/perfil/FormEditarUsuario";
import DesignUploadModal from "@/components/perfil/DesignUploadModal";
import PaymentHistory from "@/components/perfil/PaymentHistory"; // Importar el nuevo componente

function ProfileContent({ initialOrderedDesignIds = [], initialUserDesigns = [], initialUserPayments = [] }) {
  // --- INICIO DE DEBUGGING EN CLIENTE ---
  console.log('--- [CLIENTE] Props iniciales recibidas del servidor ---');
  console.log('[CLIENTE] initialUserDesigns:', initialUserDesigns);
  console.log('[CLIENTE] initialOrderedDesignIds:', initialOrderedDesignIds);
  console.log('[CLIENTE] initialUserPayments:', initialUserPayments); // Log de los pagos
  
  const { openModal } = useModal();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [activeTab, setActiveTab] = useState('designs');
  const [currentUser, setCurrentUser] = useState(null);
  const [userDesigns, setUserDesigns] = useState(initialUserDesigns);
  
  const [loading, setLoading] = useState(initialUserDesigns.length === 0); // Solo loading si no hay datos iniciales
  const [error, setError] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  
  // Inicializa el estado con los datos del servidor
  const [orderedDesignIds, setOrderedDesignIds] = useState(new Set(initialOrderedDesignIds));
  
  // Log para verificar el estado inicializado
  console.log('[CLIENTE] Estado "orderedDesignIds" inicializado como Set:', orderedDesignIds);
  console.log('--- [CLIENTE] FIN DEBUGGING INICIAL ---');

  const fetchUserData = async () => {
    if (status === 'authenticated' && userId) {
      setLoading(true);
      setError(null);

      // Fetch user data
      const fetchedUser = await ObtenerUsuarioPorId(userId);
      if (fetchedUser && fetchedUser.error) {
        setError(fetchedUser.error);
        setCurrentUser(null);
      } else {
        setCurrentUser(fetchedUser || null);
      }

      setLoading(false);
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    if (status === 'authenticated' && userId) {
      setCartLoading(true);
      setCartError(null);
      const { cart, error: fetchError } = await getCartByUserId(userId);
      if (fetchError) {
        setCartError({ message: fetchError });
        setCartItems([]);
      } else {
        setCartItems(cart?.items || []);
      }
      setCartLoading(false);
    }
  };
  
  // Este useEffect se encarga de obtener los datos del lado del cliente si es necesario
  useEffect(() => {
    fetchUserData();
    fetchCartData();
  }, [userId, status]); // Se ejecuta cuando el userId o el estado de la sesión cambian


  const handleAddItemToCart = async (item) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }
    setCartLoading(true);
    const { success, message } = await addDesignToCart(userId, item.id);
    if (success) {
      await fetchCartData();
    } else {
      setCartError({ message: message || "Error al agregar el diseño al carrito." });
    }
    setCartLoading(false);
  };

  const user = currentUser;

  const handleEditProfile = () => {
    openModal(
      "Editar Perfil",
      <FormEditarUsuario
        userData={currentUser}
        userId={userId}
        onSuccess={() => {
          openModal(
            "Perfil Actualizado",
            <div className="text-white">
              <h3 className="text-lg mb-4">¡Tu perfil ha sido actualizado exitosamente!</h3>
            </div>,
            'default'
          );
          fetchUserData();
        }}
      />,
      'default'
    );
  };

  const handleEditDesign = (design) => {
    openModal(
      "Editar Diseño",
      <div className="text-white">
        <h3 className="text-lg mb-4">Editando: {design.nombreDesing}</h3>
        <p>Formulario de edición en desarrollo...</p>
      </div>,
      'default'
    );
  };

  const handleAddDesign = () => {
    openModal(
      "Subir Nuevo Diseño",
      <DesignUploadModal onDesignSaved={fetchUserData} />,
      'default'
    );
  };

  return (
    <div className="mx-auto p-4 md:p-8 bg-black text-white w-screen flex flex-col min-h-screen">
      {/* User Info Section */}
      <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg mb-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 md:w-60 md:h-60 bg-gray-700 rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src="/img/perfil/FotoPerfil.webp" alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.primerNombre} {user?.primerApellido}</h1>
            <div className="text-gray-400 mb-3">
              <p>CORREO: {user?.correo}</p>
              <p>NÚMERO DE DOCUMENTO: {user?.numeroDocumento}</p>
              <p>NÚMERO DE TELÉFONO: {user?.numeroTelefono}</p>
              <p>DIRECCIÓN: {user?.direccion}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
              <BotonGeneral onClick={handleEditProfile}>EDITAR PERFIL</BotonGeneral>
              <Link href="/catalogo"> {/* Add Link */}
                <BotonGeneral>VER DISEÑOS DE LA COMUNIDAD</BotonGeneral> {/* Add new button */}
              </Link>
              <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })}>CERRAR SESIÓN</BotonGeneral>
            </div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="mb-8 flex-shrink-0">
        <div className="flex border-b border-gray-700">
          <button className={`py-3 px-6 text-lg font-medium ${activeTab === 'designs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`} onClick={() => setActiveTab('designs')}>DISEÑOS</button>
          <button className={`py-3 px-6 text-lg font-medium ${activeTab === 'cart' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`} onClick={() => setActiveTab('cart')}>CARRITO</button>
          <button className={`py-3 px-6 text-lg font-medium ${activeTab === 'orders' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`} onClick={() => setActiveTab('orders')}>PEDIDOS</button>
          <button className={`py-3 px-6 text-lg font-medium ${activeTab === 'payments' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`} onClick={() => setActiveTab('payments')}>PAGOS</button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'designs' && (
          loading ? <p>Cargando diseños...</p> : error ? <p>Error: {error}</p> :
          <>
            {/* Always show the Add Design button */}
            <div className="flex justify-center mb-4">
              <button onClick={handleAddDesign} className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50" aria-label="Agregar nuevo diseño">
                <img src="/icons/icono +.svg" alt="Agregar" className="w-8 h-8" />
              </button>
            </div>

            {userDesigns.length === 0 ? (
              <div className="text-center text-gray-400 text-lg mb-4">
                No tienes diseños publicados aún.
              </div>
            ) : (
              <DesignsComponent
                loading={loading}
                error={error}
                userDesigns={userDesigns}
                handleEditDesign={handleEditDesign}
                cartItems={cartItems}
                addItem={handleAddItemToCart}
                orderedDesignIds={orderedDesignIds}
              />
            )}
          </>
        )}
        {activeTab === 'orders' && (<PedidosComponent userId={user?.id} onPaymentSuccess={fetchCartData} />)} {/* Pass fetchCartData as onPaymentSuccess */}
        {activeTab === 'cart' && (<CartComponent />)}
        {activeTab === 'payments' && (<PaymentHistory payments={initialUserPayments} />)} {/* Usar PaymentHistory y pasar los pagos */}
      </div>
    </div>
  );
}

export default ProfileContent;
