"use client";

import { signOut, useSession } from "next-auth/react";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import Link from "next/link";
import { useEffect, useState } from "react";
import { obtenerDesignsPorUsuarioId, eliminarDesign, actualizarDesign } from "@/app/acciones/DesignActions";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions";
import DesignsComponent from "../common/DesignsComponent";
import PedidosComponent from "../common/PedidosComponent";
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";
import FormEditarUsuario from "@/components/perfil/FormEditarUsuario";
import DesignUploadModal from "@/components/perfil/DesignUploadModal";
import PaymentHistory from "@/components/perfil/PaymentHistory";
import { useDialog } from "@/context/DialogContext";
import { useRef, useCallback } from "react";
import FormEditarDesign from "@/components/perfil/FormEditarDesign";
import { useCart } from "@/context/CartContext";
// Removed: import NewOrderModal from "@/components/common/modales/NewOrderModal";

function ProfileContent({ initialOrderedDesignIds = [], initialUserDesigns = [], initialUserPayments = [] }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [activeTab, setActiveTab] = useState('designs');
  const [currentUser, setCurrentUser] = useState(null);
  const [userDesigns, setUserDesigns] = useState(initialUserDesigns);
  const [loading, setLoading] = useState(initialUserDesigns.length === 0);
  const [error, setError] = useState(null);
  const { showPopUp, openModal } = useDialog();
  const deleteDesignTimeoutRef = useRef(null);
  const updateDesignTimeoutRef = useRef(null);
  const { cartItems, addItem } = useCart();

  // Removed: State for NewOrderModal
  // const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const [orderedDesignIds, setOrderedDesignIds] = useState(new Set(initialOrderedDesignIds));
  
  const paymentsForHistory = Array.isArray(initialUserPayments) ? initialUserPayments : (initialUserPayments ? [initialUserPayments] : []);

  useEffect(() => {
    console.log('--- [CLIENTE] Props iniciales recibidas del servidor ---');
    console.log('[CLIENTE] initialUserDesigns:', initialUserDesigns);
    console.log('[CLIENTE] Estado "orderedDesignIds" inicializado como Set:', orderedDesignIds);
    console.log('--- [CLIENTE] FIN DEBUGGING INICIAL ---');
  }, []);

  const fetchUserData = async () => {
    if (status === 'authenticated' && userId) {
      setLoading(true);
      setError(null);

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

  const fetchUserDesigns = async () => {
    if (status === 'authenticated' && userId) {
      setLoading(true);
      setError(null);
      const { designs, error: fetchError } = await obtenerDesignsPorUsuarioId(userId);
      if (fetchError) {
        setError(fetchError);
        setUserDesigns([]);
      } else {
        setUserDesigns(designs || []);
      }
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    fetchUserDesigns();
  }, [userId, status]);

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

  const handleUpdateDesign = useCallback(async (updatedDesignData) => {
    const originalDesigns = userDesigns;
    const designId = updatedDesignData._id || updatedDesignData.id;

    setUserDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design._id === designId ? { ...design, ...updatedDesignData } : design
      )
    );
    showPopUp("Actualizando diseño...", "info");

    if (updateDesignTimeoutRef.current) {
      clearTimeout(updateDesignTimeoutRef.current);
    }

    updateDesignTimeoutRef.current = setTimeout(async () => {
      try {
        const formData = new FormData();
        for (const key in updatedDesignData) {
          if (updatedDesignData[key] !== null && updatedDesignData[key] !== undefined) {
            if (key === 'coloresDisponibles' || key === 'tallasDisponibles') {
              formData.append(key, updatedDesignData[key].join(','));
            } else {
              formData.append(key, updatedDesignData[key]);
            }
          }
        }
        formData.set('id', designId);

        const { success, message, data: returnedDesign } = await actualizarDesign(null, formData);

        if (success) {
          showPopUp("Diseño actualizado exitosamente.", "success");
          if (returnedDesign) {
            setUserDesigns(prevDesigns =>
              prevDesigns.map(design =>
                design._id === designId ? { ...design, ...returnedDesign } : design
              )
            );
          }
        } else {
          setUserDesigns(originalDesigns);
          showPopUp(message || "Error al actualizar el diseño. Revertido.", "error");
          console.error("Error al actualizar el diseño:", message);
        }
      } catch (error) {
        setUserDesigns(originalDesigns);
        showPopUp("Error de red al actualizar el diseño. Revertido.", "error");
        console.error("Error de red al actualizar el diseño:", error);
      }
    }, 500);
  }, [userDesigns, showPopUp]);


  const handleEditDesign = (design) => {
    openModal(
      "Editar Diseño",
      <FormEditarDesign
        designData={design}
        onSuccess={(updatedDesign) => {
          handleUpdateDesign(updatedDesign);
          openModal(
            "Diseño Actualizado",
            <div className="text-white">
              <h3 className="text-lg mb-4">¡Tu diseño ha sido actualizado exitosamente!</h3>
            </div>,
            'default'
          );
        }}
      />,
      'default'
    );
  };

  const handleDeleteDesign = useCallback(async (designId) => {
    const originalDesigns = userDesigns;
    setUserDesigns(prevDesigns => prevDesigns.filter(design => design._id !== designId));
    showPopUp("Eliminando diseño...", "info");

    if (deleteDesignTimeoutRef.current) {
      clearTimeout(deleteDesignTimeoutRef.current);
    }

    deleteDesignTimeoutRef.current = setTimeout(async () => {
      try {
        const { success, message } = await eliminarDesign(designId);
        if (success) {
          showPopUp("Diseño eliminado exitosamente.", "success");
        } else {
          setUserDesigns(originalDesigns);
          showPopUp(message || "Error al eliminar el diseño. Revertido.", "error");
          console.error("Error al eliminar el diseño:", message);
        }
      } catch (error) {
        setUserDesigns(originalDesigns);
        showPopUp("Error de red al eliminar el diseño. Revertido.", "error");
        console.error("Error de red al eliminar el diseño:", error);
      }
    }, 500);
  }, [userDesigns, showPopUp]);

  const handleAddDesign = () => {
    openModal(
      "Subir Nuevo Diseño",
      <DesignUploadModal onDesignSaved={fetchUserDesigns} />,
      'default'
    );
  };

  // Removed: const handleCreateNewOrder = () => { setIsNewOrderModalOpen(true); };

  return (
    <div className="mx-auto p-4 md:p-8 bg-black text-white w-screen flex flex-col min-h-screen">
      {/* User Info Section */}
      <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg mb-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 md:w-60 md:h-60 bg-gray-700 rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src="/img/perfil/FotoPerfil.webp" alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.Nombre} {user?.primerApellido}</h1>
            <div className="text-gray-400 mb-3">
              <p>CORREO: {user?.correo}</p>
              <p>NÚMERO DE DOCUMENTO: {user?.numeroDocumento}</p>
              <p>NÚMERO DE TELÉFONO: {user?.numeroTelefono}</p>
              <p>DIRECCIÓN: {user?.direccion}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
              <Link href="/catalogo">
                <BotonGeneral>VER DISEÑOS DE LA COMUNIDAD</BotonGeneral>
              </Link>
              {/* Removed: <BotonGeneral onClick={handleCreateNewOrder}>CREAR NUEVO PEDIDO</BotonGeneral> */}
              <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })}>CERRAR SESIÓN</BotonGeneral>
            </div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="mb-8 flex-shrink-0">
        <div className="flex border-b border-gray-700">
          <button className={`py-3 px-6 text-lg font-medium ${activeTab === 'designs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'} focus:outline-none`} onClick={() => setActiveTab('designs')}>DISEÑOS</button>
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
                handleDeleteDesign={handleDeleteDesign}
                cartItems={cartItems}
                addItem={addItem}
                mode="profile"
              />
            )}
          </>
        )}
        {activeTab === 'orders' && (<PedidosComponent userId={user?.id} />)}
        {activeTab === 'payments' && (<PaymentHistory payments={paymentsForHistory} />)}
      </div>

    </div>
  );
}

export default ProfileContent;
