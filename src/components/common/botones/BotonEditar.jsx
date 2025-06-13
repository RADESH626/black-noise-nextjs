import { IconoEditar } from '@/components/common/iconos'

<<<<<<< HEAD
function BotonEditar({ children }) {
    return (
        <button
            type="submit"
=======
function BotonEditar({ children, onClick }) {
    return (
        <button
            type="button" // Changed from "submit" to "button" to prevent unintended form submissions
            onClick={onClick} // Pass the onClick prop to the button
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
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
<<<<<<< HEAD
            focus:ring-green-500
            "
        >
            editar
=======
            focus:ring-blue-500
            "
        >
            {children || 'Editar'} {/* Render children or default text */}
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
            {/* <IconoEditar /> */}
        </button>
    )
}

export default BotonEditar
