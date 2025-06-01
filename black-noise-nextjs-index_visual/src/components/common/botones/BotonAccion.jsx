// src/components/common/botones/BotonAccion.jsx
import Link from 'next/link';

export function BotonAccion({
    texto,
    icono: Icono,
    href,
    onClick,
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

    const contenido = (
        <>
            {Icono && <Icono className="fill-current w-4 h-4 mr-2" />}
            <span>{texto}</span>
        </>
    );

    // Si hay href, renderizar como Link
    if (href) {
        return (
            <Link href={href} className={clasesFinal} {...props}>
                {contenido}
            </Link>
        );
    }

    // Si no hay href, renderizar como botón
    return (
        <button 
            onClick={onClick} 
            className={clasesFinal}
            type={props.type || 'button'}
            {...props}
        >
            {contenido}
        </button>
    );
}

export default BotonAccion;
