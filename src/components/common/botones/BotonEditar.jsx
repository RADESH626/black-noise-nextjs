import IconoEditar from '@/components/common/iconos/IconoEditar'

function BotonEditar({ children }) {
    return (
        <button
            type="submit"
            className="
            h-full
            w-full
            flex
            flex-row
            items-center
            justify-center
            gap-2
            bg-blue-500
            text-black
            font-semibold
            rounded-lg
            shadow-md
            hover:bg-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400 
            focus:ring-opacity-75
            p-3
            "
        >
            editar
            <IconoEditar />
        </button>
    )
}

export default BotonEditar