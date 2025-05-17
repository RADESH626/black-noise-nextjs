import AdminFormPage from "@/components/layout/admin/AdminFormPage";
import HeaderAdminDashboard from "@/components/layout/admin/AdminHeader";
import FormEditarUsuario from "@/app/admin/usuarios/FormEditarUsuario";

async function page(searchParams) {

    const params = await searchParams.params;

    const { id } = params;

    return (

        <div>

            <HeaderAdminDashboard />

            <AdminFormPage>

                <FormEditarUsuario UserId={id} />

            </AdminFormPage>

        </div>

    )
}

export default page

//TODO:agregar logica de la pagina
