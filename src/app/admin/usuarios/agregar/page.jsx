import FormAgregarUsuarios from '@/components/layout/forms/FormAgregarUsuarios'
import FormLayoutAdmin from '@/components/layout/forms/FormLayoutAdmin'
import React from 'react'

function nuevo() {
    return (
        <FormLayoutAdmin>
            <FormAgregarUsuarios className="w-full" />
        </FormLayoutAdmin>
    )
}

export default nuevo