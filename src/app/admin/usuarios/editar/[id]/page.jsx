import AdminFormPage from "@/components/admin/AdminFormPage";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions"; // Import the action
import HeaderAdminDashboard from "@/components/admin/AdminHeader";

async function page({ params }) { // Destructure params directly

    const { id } = params;

    // Fetch user data using the imported action
    const initialUserData = await ObtenerUsuarioPorId(id);

    // Handle case where user is not found (optional, FormEditarUsuario already handles null)
    if (!initialUserData) {
        // You might want to render an error message or redirect
        return (
            <div>
                <HeaderAdminDashboard />
                <AdminFormPage>
                    <div className="text-red-500 text-center p-4">
                        Usuario no encontrado.
                    </div>
                </AdminFormPage>
            </div>
        );
    }


    return (

        <div>

            <HeaderAdminDashboard /> {/* Corrected component name */}

            <AdminFormPage>

                {/* Pass the fetched user data as initialUserData prop */}
                <FormEditarUsuario initialUserData={initialUserData} userId={id} />

            </AdminFormPage>

        </div>

    )
}

export default page
