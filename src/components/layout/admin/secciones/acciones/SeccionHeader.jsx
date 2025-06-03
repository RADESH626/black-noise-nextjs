import React from 'react'

function SeccionHeader({children}) {
    return (
        <header className='bg-gray-300 w-full flex flex-col justify-center items-center p-4 gap-4 rounded-t-2xl ' >

            {children}

        </header>
    )
}

export default SeccionHeader