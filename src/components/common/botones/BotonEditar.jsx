import { IconoEditar } from '@/components/common/iconos'

function BotonEditar({ children, onClick }) {
    return (
        <button
            type="button" // Changed from "submit" to "button" to prevent unintended form submissions
            onClick={onClick} // Pass the onClick prop to the button
            className="
            px-2 py-2
            font-semibold 
            rounded-lg 
            shadow-md 
            focus:outline-none 
            focus:ring-2 
            focus:ring-opacity-75
            bg-blue-600 
            text-white 
            hover:bg-blue-700 
            focus:ring-blue-500
            "
        >
            {children || 'Editar'} {/* Render children or default text */}
            {/* <IconoEditar /> */}
        </button>
    )
}

export default BotonEditar
