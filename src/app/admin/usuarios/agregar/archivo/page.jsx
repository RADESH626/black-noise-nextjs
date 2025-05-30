import AdminFormPage from '@/components/admin/AdminFormPage'
import FormCargaMasivaUsuarios from '@/components/admin/usuarios/forms/FormCargaMasivaUsuarios'

function archivo() {
  return (
    <div>
        <AdminFormPage>
            <FormCargaMasivaUsuarios className="w-full" />
        </AdminFormPage>
    </div>
  )
}

export default archivo
