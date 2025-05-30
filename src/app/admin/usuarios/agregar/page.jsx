import FormAgregarUsuarios from '@/components/admin/usuarios/forms/FormAgregarUsuarios'
import AdminFormPage from '@/components/admin/AdminFormPage'

function nuevo() {
    return (
        <AdminFormPage>
            <FormAgregarUsuarios className="w-full" />
        </AdminFormPage>
    )
}

export default nuevo
