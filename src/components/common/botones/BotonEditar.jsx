import IconoEditar from '@/components/common/iconos/IconoEditar'

function BotonEditar() {
    return (
        <button
            type="submit"
            className="
            items-center
            px-4
            py-2
            bg-blue-500
            text-white
            font-semibold
            rounded-lg
            shadow-md
            hover:bg-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400 
            focus:ring-opacity-75"
            title="Editar"
        >
           <IconoEditar />
        </button>
    )
}

export default BotonEditar