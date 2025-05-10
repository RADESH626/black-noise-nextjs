import AdminFormPage from '@/components/layout/admin/AdminFormPage'
import FormCargaMasivaUsuarios from '@/components/layout/admin/forms/FormCargaMasiva'

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