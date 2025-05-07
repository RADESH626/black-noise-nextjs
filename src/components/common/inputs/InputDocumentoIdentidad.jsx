
function inputDocumentoIdentidad(porps) {
    return (
        <input type="text" pattern="[0-9]{6,12}"
            className="w-full
            p-3
            bg-bn-input-bg
            text-bn-secondary
            border
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque
            placeholder:text-bn-accent "
            placeholder="Número de documento"
            {...porps}
        />
    )
}

export default inputDocumentoIdentidad