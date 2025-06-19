import React from 'react'

function SeccionFooter({ children }) {
    return (
        <footer className="flex flex-row  justify-r w-full h-full bg-gray-600  p-4 gap-4">

            {children}
            
        </footer>
    )
}

export default SeccionFooter