import React from 'react'

function BotonExportarPDF(props) {
    return (
        <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded shadow-sm bg-gray-400 text-black font-bold text-base transition-colors duration-300 hover:bg-green-700"
            {...props}
        >
            exportar a PDF
        </button>
    )
}

export default BotonExportarPDF