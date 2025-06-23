import React from 'react'
import SeccionHeader from './SeccionHeader'
import SeccionFooter from './SeccionFooter'

function SeccionAcciones({children}) {
    return (
        <section className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl  ">

            {children}
            
        </section>
    )
}

export default SeccionAcciones