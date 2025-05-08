import FormLayoutAdmin from '@/components/layout/forms/FormLayoutAdmin'
import FormCargaMasivaUsuarios from '@/components/layout/forms/FormCargaMasiva'

function archivo() {
  return (
    <div>
        <FormLayoutAdmin>
            <FormCargaMasivaUsuarios className="w-full" />

        </FormLayoutAdmin>
    </div>
  )
}

export default archivo