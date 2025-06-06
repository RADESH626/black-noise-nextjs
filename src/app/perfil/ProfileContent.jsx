"use client";

import { useModal } from "@/context/ModalContext";
<<<<<<< HEAD
import { signOut, useSession } from "next-auth/react"; // Import signOut and useSession
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";
import { useCart } from "@/context/CartContext"; // Import useCart
import { useEffect, useState } from "react"; // Import useEffect and useState
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions"; // Import the server action

function ProfileContent() { // Removed user, designs, and error props
  const { openModal } = useModal();
  const { cartItems, addItem } = useCart(); // Get cartItems and addItem from context
  const { data: session, status } = useSession(); // Get session using useSession

=======
import { signOut } from "next-auth/react"; // Import signOut
import { useSimulatedSession } from "@/hooks/useSimulatedSession"; // Import useSimulatedSession
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions"; // Import the server action
import { useMockData } from "@/hooks/useMockData"; // Import useMockData
import DesignsComponent from "./DesignsComponent"; // Import DesignsComponent
import PedidosComponent from "./PedidosComponent"; // Import PedidosComponent
import CartComponent from "./CartComponent"; // Import CartComponent

function ProfileContent() { // Removed user, designs, and error props
  const { openModal } = useModal();
  const { data: session, status } = useSimulatedSession(); // Get session using useSimulatedSession
  const { mockDataEnabled } = useMockData(); // Get mockDataEnabled from useMockData

  const [activeTab, setActiveTab] = useState('designs'); // State to manage active tab
  const [currentUser, setCurrentUser] = useState(null); // State for user data
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
=======
    console.log("Mock Data Enabled in ProfileContent:", mockDataEnabled);
  }, [mockDataEnabled]);

  useEffect(() => {
    // Update currentUser when session changes
    setCurrentUser(session?.user || null);

>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    const fetchDesigns = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        setLoading(true);
        setError(null);
<<<<<<< HEAD
        const { designs, error } = await obtenerDesignsPorUsuarioId(session.user.id);
=======
        // Pass mockDataEnabled to the server action
        const { designs, error } = await obtenerDesignsPorUsuarioId(session.user.id, mockDataEnabled);
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        if (error) {
          setError(error);
        } else {
          setUserDesigns(designs || []);
        }
        setLoading(false);
      } else if (status === 'unauthenticated') {
        // Handle unauthenticated state if necessary, maybe redirect to login
        setLoading(false);
<<<<<<< HEAD
=======
        setUserDesigns([]); // Clear designs if unauthenticated
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
      }
    };

    fetchDesigns();
<<<<<<< HEAD
  }, [session, status]); // Rerun effect when session or status changes

  const user = session?.user; // Get user from session
=======
  }, [session, status, mockDataEnabled]); // Rerun effect when session, status, or mockDataEnabled changes

  const user = currentUser; // Use the state variable for user
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

  const handleEditProfile = () => {
    openModal(
      "Editar Perfil", 
      <FormEditarUsuario UserId={user?.id} isProfile={true} />,
      'large' // Usamos tamaño grande para el formulario de perfil
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
    <div className="mx-auto p-4 md:p-8  bg-black text-white w-screen h-screen">
      {/* User Info Section - Re-added here */}
      <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* imagen */}
          <div className="w-32 h-32 md:w-60 md:h-60 bg-gray-700 rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src="/img/perfil/FotoPerfil.webp" alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* seccion info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.primerNombre} {user?.primerApellido}</h1> {/* Use fetched name */}

            {/* info */}
            <div className="text-gray-400 mb-3">
              <p>CORREO: {user?.correo}</p> {/* Use fetched email */}
              <p>NÚMERO DE LIKES: {user?.likes || 0}</p> {/* Use fetched likes */}
              <p>BIOGRAFÍA: {user?.bio ? user.bio : "..."}</p> {/* Use fetched bio */}
            </div>

            {/* botones */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
              <BotonGeneral onClick={handleEditProfile}>
                EDITAR PERFIL
              </BotonGeneral>

              <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })}>
                CERRAR SESIÓN
              </BotonGeneral>

<<<<<<< HEAD
              <BotonGeneral onClick={() => { /* Add logic for editing/adding designs */ }}>
                EDITAR DISEÑO
              </BotonGeneral>

=======
              
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
            </div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="mb-8">
        <div className="flex border-b border-gray-700">
<<<<<<< HEAD
          <button className="py-3 px-6 text-lg font-medium text-purple-400 border-b-2 border-purple-400 focus:outline-none">
            DISEÑOS
          </button>
          <button className="py-3 px-6 text-lg font-medium text-gray-500 hover:text-gray-300 focus:outline-none">
=======
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'designs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('designs')}
          >
            DISEÑOS
          </button>
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'orders' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('orders')}
          >
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
            PEDIDOS
          </button>
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'cart' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`}
            onClick={() => setActiveTab('cart')}
          >
            CARRITO
          </button>
        </div>
      </nav>

<<<<<<< HEAD
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-400">Cargando diseños...</div>
        ) : error ? (
          <div className="col-span-full text-red-500 text-center">
            Error al cargar los diseños: {error}
          </div>
        ) : userDesigns.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No tienes diseños publicados aún.
          </div>
        ) : (
          userDesigns.map((design) => (
            <div key={design._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-56 bg-gray-700 relative">
                <img
                  src={design.imagenDesing}
                  alt={design.nombreDesing}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-3">
                  <button
                    onClick={() => handleEditDesign(design)}
                    className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                  >
                    EDITAR
                  </button>
                </div>
              </div>
              <div className="p-4 gradient-text-bg flex justify-between items-center"> {/* Added flex and justify-between */}
                <div> {/* Added div for text content */}
                  <p className="font-semibold">nombre: {design.nombreDesing}</p>
                  <p className="font-semibold">precio: ${design.valorDesing}</p>
                  <p className="font-semibold">categoría: {design.categoria}</p>
                  <p className="font-semibold text-purple-400">likes: {design.likes}</p>
                </div>
                {/* Checkbox for adding to cart */}
                <input
                  type="checkbox"
                  checked={cartItems.some(item => item.id === design._id)} // Check if item is in cart
                  onChange={() => addItem({ // Add item to cart on change
                    id: design._id,
                    nombre: design.nombreDesing,
                    price: design.valorDesing,
                    imagen: design.imagenDesing,
                  })}
                  className="form-checkbox h-5 w-5 text-purple-600" // Basic styling
                />
              </div>
            </div>
          ))
        )}
      </main>
=======
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
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    </div>
  );
}

export default ProfileContent;


//TODO: Implementar función para cerrar sesión
