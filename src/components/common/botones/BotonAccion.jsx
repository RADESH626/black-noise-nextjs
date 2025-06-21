// src/components/common/botones/BotonAccion.jsx
import Link from 'next/link';
<<<<<<< HEAD
import BotonGeneral from './BotonGeneral';
=======
>>>>>>> c32cb53 (primer commit)

export function BotonAccion({
    texto,
    icono: Icono,
    href,
    onClick,
<<<<<<< HEAD
    tipo = 'primario', // primario, secundario, peligro, exito, info, destacado, advertencia
    className = '',
    ...props
}) {
    const getVariant = (tipo) => {
        switch (tipo) {
            case 'primario':
            case 'destacado':
                return 'primary';
            case 'secundario':
            case 'advertencia':
                return 'secondary';
            case 'peligro':
                return 'danger';
            case 'exito':
                return 'success';
            case 'info':
                return 'info';
            default:
                return 'primary';
        }
    };

=======
    tipo = 'primario', // primario, secundario, peligro
    className = '',
    ...props
}) {
    // Clases base comunes
    const baseClasses = "font-bold py-2 px-4 rounded inline-flex items-center";
    
    // Variantes de color según tipo
    const tipoClasses = {
        primario: "bg-blue-500 hover:bg-blue-700 text-white",
        secundario: "bg-gray-500 hover:bg-gray-700 text-white",
        peligro: "bg-red-500 hover:bg-red-700 text-white",
        exito: "bg-green-500 hover:bg-green-700 text-white",
        info: "bg-teal-500 hover:bg-teal-700 text-white",
        destacado: "bg-purple-500 hover:bg-purple-700 text-white",
        advertencia: "bg-yellow-500 hover:bg-yellow-700 text-white"
    };

    const clasesFinal = `${baseClasses} ${tipoClasses[tipo]} ${className}`;

>>>>>>> c32cb53 (primer commit)
    const contenido = (
        <>
            {Icono && <Icono className="fill-current w-4 h-4 mr-2" />}
            <span>{texto}</span>
        </>
    );

<<<<<<< HEAD
    if (href) {
        return (
            <span
                onClick={onClick}
                className={`font-bold py-2 px-4 rounded inline-flex items-center ${className}`} // Keep base styling for span
=======
    // If href is provided, it means this component is likely a child of a Next.js Link or custom LinkComponent.
    // In this case, we should render a span or div that can be wrapped by the parent Link.
    // The onClick should still be handled by this component if provided.
    if (href) {
        return (
            <span
                onClick={onClick} // Keep onClick for internal actions if needed
                className={clasesFinal}
>>>>>>> c32cb53 (primer commit)
                {...props}
            >
                {contenido}
            </span>
        );
    }

<<<<<<< HEAD
    return (
        <BotonGeneral
            onClick={onClick}
            variant={getVariant(tipo)}
            type={props.type || 'button'}
            className={`inline-flex items-center ${className}`} // BotonGeneral handles padding, font-weight, rounded
            {...props}
        >
            {contenido}
        </BotonGeneral>
=======
    // If no href, render as a button (original behavior)
    return (
        <button 
            onClick={onClick} 
            className={clasesFinal}
            type={props.type || 'button'}
            {...props}
        >
            {contenido}
        </button>
>>>>>>> c32cb53 (primer commit)
    );
}

export default BotonAccion;
