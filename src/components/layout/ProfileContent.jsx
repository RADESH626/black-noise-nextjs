"use client";

import { signOut, useSession } from "next-auth/react";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { eliminarDesign, actualizarDesign } from "@/app/acciones/DesignActions";
import DesignsComponent from "../common/DesignsComponent";
import Loader from '@/components/Loader';
import PedidosClientePage from "../perfil/pedidos/PedidosClientePage"; // Importar el nuevo componente
import FormEditarUsuario from "@/components/perfil/FormEditarUsuario";
import DesignUploadModal from "@/components/perfil/DesignUploadModal";
import PaymentHistory from "@/components/perfil/PaymentHistory";
import { useDialog } from "@/context/DialogContext";
import FormEditarDesign from "@/components/perfil/FormEditarDesign";
import { useCart } from "@/context/CartContext";
import HeaderPrincipal from "./general/HeaderPrincipal";
// Removed: import NewOrderModal from "@/components/common/modales/NewOrderModal";

function ProfileContent({ userId, initialUser, initialDesigns, initialPayments, initialPedidos }) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('designs');
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [userDesigns, setUserDesigns] = useState(initialDesigns);
  const [loading, setLoading] = useState(false); // Ya cargado por el Server Component
  const [error, setError] = useState(null);
  const { showPopUp, openModal } = useDialog();
  const deleteDesignTimeoutRef = useRef(null);
  const updateDesignTimeoutRef = useRef(null);
  const { cartItems, addItem } = useCart();
  const [orderedDesignIds, setOrderedDesignIds] = useState(new Set());
  const [paymentsForHistory, setPaymentsForHistory] = useState(initialPayments);

  const fetchUserDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace this with your actual data fetching logic
      // For example, you might call an API endpoint to get the user's designs
      const response = await fetch(`/api/designs?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserDesigns(data);
    } catch (error) {
      setError(error);
      console.error("Failed to fetch user designs:", error);
      showPopUp("Failed to fetch user designs.", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, showPopUp]);

  useEffect(() => {
    console.log('--- [CLIENTE] Montando ProfileContent ---');
    console.log('[CLIENTE] userId:', userId);
    console.log('--- [CLIENTE] FIN DEBUGGING INICIAL ---');
  }, [userId]);

  // Mantener fetchUserData para re-obtener datos si el perfil se edita
  const fetchUserData = useCallback(async () => {
    if (status === 'authenticated' && userId) {
      // Aquí necesitarías una acción de servidor para obtener el usuario por ID
      // Si no hay una acción de servidor que solo obtenga el usuario,
      // podrías necesitar crear una o reevaluar cómo se actualiza el usuario.
      // Por ahora, asumimos que la edición de perfil ya maneja la actualización del estado local.
      // Si se necesita re-fetch, se haría a través de una API route o Server Action.
      // Por simplicidad, si la edición de perfil ya actualiza el estado, esta función podría no ser necesaria.
      // Si se necesita, se debería llamar a una acción de servidor aquí.
      // Por ejemplo: const fetchedUser = await ObtenerUsuarioPorId(userId);
      // Para este caso, la eliminamos ya que la carga inicial se hace en el servidor.
    }
  }, [status, userId]);

  // Estas funciones ya no son necesarias para la carga inicial, ya que los datos vienen de props.
  // Si se necesita re-fetch de diseños o pagos, se debería implementar una Server Action o API Route.
  // Por ahora, las eliminamos.

  useEffect(() => {
    // No es necesario llamar a fetchUserData, fetchUserDesigns, fetchUserPayments aquí
    // ya que los datos iniciales se pasan como props.
    // Si se necesita re-fetch después de ciertas acciones, se llamaría a las acciones de servidor correspondientes.
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

    setUserDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
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
            setUserDesigns((prevDesigns) =>
              prevDesigns.map((design) =>
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
    setUserDesigns((prevDesigns) => prevDesigns.filter((design) => design._id !== designId));
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

  return (
    <div className="mx-auto p-4 md:p-8 bg-gray-300 text-white w-screen flex flex-col min-h-screen">
      {/* Header */}
      <HeaderPrincipal />


      {/* User Info Section */}
      <div className="bg-gray-400 p-6 md:p-8 rounded-lg shadow-lg mb-8 flex-shrink-0 text-black mt-10">

        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 md:w-60 md:h-60 bg-white rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src={user?.profileImageUrl || "/img/perfil/FotoPerfil.webp"} alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.Nombre} {user?.primerApellido}</h1>
            <div className="text-black mb-3">
              <p>CORREO: {user?.correo}</p>
              <p>NÚMERO DE DOCUMENTO: {user?.numeroDocumento}</p>
              <p>NÚMERO DE TELÉFONO: {user?.numeroTelefono}</p>
              <p>DIRECCIÓN: {user?.direccion}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
              <BotonGeneral onClick={handleEditProfile} variant="info" className="bg-black rounded-full p-2">
                EDITAR PERFIL
              </BotonGeneral>
              <Link href="/catalogo">
                <BotonGeneral variant="secondary">VER DISEÑOS DE LA COMUNIDAD</BotonGeneral>
              </Link>
              <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })} variant="primary">
                CERRAR SESIÓN
              </BotonGeneral>
            </div>
          </div>
        </div>
      </div>

      <nav className="mb-8 flex-shrink-0">
        <div className="flex border-b border-black">
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'designs' ? 'text-black border-b-2 border-red-400' : 'text-black hover:text-black'
              } focus:outline-none`}
            onClick={() => setActiveTab('designs')}
          >
            DISEÑOS
          </button>
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'orders' ? 'text-black border-b-2 border-red-400' : 'text-black hover:text-black'
              } focus:outline-none`}
            onClick={() => setActiveTab('orders')}
          >
            PEDIDOS
          </button>
          <button
            className={`py-3 px-6 text-lg font-medium ${activeTab === 'payments' ? 'text-black border-b-2 border-red-400' : 'text-black hover:text-black'
              } focus:outline-none`}
            onClick={() => setActiveTab('payments')}
          >
            PAGOS
          </button>
        </div>
      </nav>

      <div className="flex-grow overflow-y-auto">
        {activeTab === 'designs' && (
          loading ? (
            <Loader />
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <BotonGeneral onClick={handleAddDesign} className="bg-black rounded-full p-2">
                  <img src="/icons/icono +.svg" alt="Agregar" className="w-8 h-8" />
                </BotonGeneral>
              </div>
              {userDesigns.length === 0 ? (
                <div className="text-center text-black text-lg mb-4">No tienes diseños publicados aún.</div>
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
          )
        )}
        {activeTab === 'orders' && (
          <>
            {userId && console.log('DEBUG - Renderizando PedidosClientePage con userId:', userId)}
            {userId ? (
              <PedidosClientePage initialPedidos={initialPedidos} /> 
            ) : (
              <Loader />
            )}
          </>
        )}
        {activeTab === 'payments' && <PaymentHistory payments={paymentsForHistory} />}
      </div>
    </div>
  );
}

export default ProfileContent;
