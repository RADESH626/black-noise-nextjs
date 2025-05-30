import FormAgregarUsuarios from '@/components/layout/admin/usuarios/forms/FormAgregarUsuarios'
import AdminFormPage from '@/components/layout/admin/AdminFormPage'

function nuevo() {
    return (
        <AdminFormPage>
            <FormAgregarUsuarios className="w-full" />
        </AdminFormPage>
    )
}

export default nuevo