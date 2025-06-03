import { IconoEditar } from '@/components/common/iconos'

function BotonEditar({ children }) {
    return (
        <button
            type="submit"
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
            focus:ring-green-500
            h-full
            w-full
            "
        >
            editar
            {/* <IconoEditar /> */}
        </button>
    )
}

export default BotonEditar
