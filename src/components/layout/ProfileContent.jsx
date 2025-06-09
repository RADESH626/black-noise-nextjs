"use client";

import { useModal } from "@/context/ModalContext";
import { signOut, useSession } from "next-auth/react"; // Import signOut and useSession
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import { useCartStorage } from "@/hooks/useCartStorage"; // Import useCartStorage
import { useEffect, useState } from "react"; // Import useEffect and useState
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions"; // Import the server action
import DesignsComponent from "./DesignsComponent"; // Import DesignsComponent
import PedidosComponent from "./PedidosComponent"; // Import PedidosComponent
import CartComponent from "./CartComponent"; // Import CartComponent
import PagosComponent from "./PagosComponent"; // Import PagosComponent
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions"; // Import the server action

function ProfileContent() { // Removed user, designs, and error props
  const { openModal } = useModal();
  const { cartItems, addItem } = useCartStorage(); // Get cartItems and addItem from context
  const { data: session, status } = useSession(); // Get session using useSession

  const [activeTab, setActiveTab] = useState('designs'); // State to manage active tab
  const [currentUser, setCurrentUser] = useState(null); // State for user data
  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        setLoading(true);
        setError(null);

        // Fetch full user data
        const fetchedUser = await ObtenerUsuarioPorId(session.user.id);
        if (fetchedUser && fetchedUser.error) { // Check if fetchedUser is an error object
          setError(fetchedUser.error);
          setCurrentUser(null);
        } else {
          setCurrentUser(fetchedUser || null);
        }

        // Fetch designs
        const { designs, error: designsError } = await obtenerDesignsPorUsuarioId(session.user.id);
        if (designsError) {
          setError(designsError);
        } else {
          setUserDesigns(designs || []);
        }
        setLoading(false);
      } else if (status === 'unauthenticated') {
        setLoading(false);
        setCurrentUser(null);
        setUserDesigns([]);
      }
    };

    fetchData();
  }, [session, status]); // Rerun effect when session or status changes

  const user = currentUser; // Use the state variable for user

  const handleEditProfile = () => {
    openModal(
      "Editar Perfil",
      <div className="text-white">
        <h3 className="text-lg mb-4">Funcionalidad de edición de perfil no disponible.</h3>
        <p>El componente FormEditarUsuario no fue encontrado.</p>
      </div>,
      'default'
    );
  };

  const handleEditDesign = (design) => {
    openModal(
      "Editar Diseño",
      <div className="text-white">
        <h3 className="text-lg mb-4">Editando: {design.nombreDesing}</h3>
        {/* Aquí puedes agregar el formulario de edición de diseño */}
        <p>Formulario de edición en desarrollo...</p>
      </div>,
      'default' // Usamos tamaño default para edición de diseños
    );
  };

  return (
    <div className="mx-auto p-4 md:p-8 bg-black text-white w-screen flex flex-col min-h-screen">
      {/* User Info Section */}
      <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg mb-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row items-center">
          {/* imagen */}
          <div className="w-32 h-32 md:w-60 md:h-60 bg-gray-700 rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src="/img/perfil/FotoPerfil.webp" alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* seccion info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.primerNombre} {user?.primerApellido}</h1>

            {/* info */}
            <div className="text-gray-400 mb-3">
              <p>CORREO: {user?.correo}</p>
              <p>TIPO DE DOCUMENTO: {user?.tipoDocumento}</p>
              <p>NÚMERO DE DOCUMENTO: {user?.numeroDocumento}</p>
              <p>FECHA DE NACIMIENTO: {user?.fechaNacimiento}</p>
              <p>GÉNERO: {user?.genero}</p>
              <p>NÚMERO DE TELÉFONO: {user?.numeroTelefono}</p>
              <p>DIRECCIÓN: {user?.direccion}</p>
              <p>NÚMERO DE LIKES: {user?.likes || 0}</p>
              <p>BIOGRAFÍA: {user?.bio ? user.bio : "..."}</p>
            </div>

            {/* botones */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
              <BotonGeneral onClick={handleEditProfile}>
                EDITAR PERFIL
              </BotonGeneral>

              <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })}>
                CERRAR SESIÓN
              </BotonGeneral>

            </div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="mb-8 flex-shrink-0">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'designs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('designs')}
          >
            DISEÑOS
          </button>

          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'cart' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('cart')}
          >
            CARRITO
          </button>

          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'orders' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('orders')}
          >
            PEDIDOS
          </button>

          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'payments' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('payments')}
          >
            PAGOS
          </button>
          
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'designs' && (
          <DesignsComponent
            loading={loading}
            error={error}
            userDesigns={userDesigns}
            handleEditDesign={handleEditDesign}
          />
        )}

        {activeTab === 'orders' && (
          <PedidosComponent userId={user?.id} />
        )}

        {activeTab === 'cart' && (
          <CartComponent />
        )}

        {activeTab === 'payments' && (
          <PagosComponent userId={user?.id} />
        )}
      </div>
    </div>
  );
}

export default ProfileContent;


//TODO: Implementar función para cerrar sesión
