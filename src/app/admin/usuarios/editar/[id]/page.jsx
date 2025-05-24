import AdminFormPage from "@/components/layout/admin/AdminFormPage";
import HeaderPrincipal from "@/components/layout/general/HeaderPrincipal";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";

async function page(searchParams) {

    const params = await searchParams.params;

    const { id } = params;

    return (

        <div>

            <HeaderPrincipal />

            <AdminFormPage>

                <FormEditarUsuario UserId={id} />

            </AdminFormPage>

        </div>

    )
}

export default page

